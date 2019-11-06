#from .utils.alipay import AliPay
from ALI.AliPay import AliPay
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from rest_framework import permissions

from .settings import ALIPAY_APPID, APP_PRIVATE_KEY_PATH, ALIPAY_PUBLIC_KEY_PATH, ALIPAY_DEBUG, ALIPAY_URL
from .models import OrderInfo
from .serializers import OrderInfoSerializer

def get_server_ip():
    return '47.100.162.64'

def create_alipay():
    server_ip = get_server_ip()
    alipay = AliPay(
        appid = ALIPAY_APPID,
        app_notify_url = "http://{}:8000/alipayreturn".format(server_ip),
        app_private_key_path = APP_PRIVATE_KEY_PATH,
        alipay_public_key_path = ALIPAY_PUBLIC_KEY_PATH,
        sign_type = "RSA2",
        debug = ALIPAY_DEBUG
    )
    return alipay

def get_alipay_url(alipay, total_amount, trade_no):
    server_ip = get_server_ip()
    order_string =  alipay.api_alipay_trade_page_pay(
        out_trade_no=trade_no,  #订单id
        total_amount=str(total_amount), #支付宝总金额
        subject="networkTestPay", #订单标题
        return_url="http://{}:8000/alipayreturn".format(server_ip),
        notify_url="http://{}:8000/alipayreturn".format(server_ip)
    )
    print('---get_url---')
    print(order_string)
    return ALIPAY_URL+order_string

def get_trade_no(self):
    from random import Random
    random_ins = Random()
    trade_no = "{time_str}{userid}{ranstr}".format(time_str=time.strftime("%Y%m%d%H%M%S"),
                userid=self.context["request"].user.id,
                ranstr=random_ins.randint(10, 99))
    return trade_no


# Create your views here.
class OrderView(APIView):
    # permission_classes = (IsAuthenticated, )
    
    def get(self, request):
        server_ip = get_server_ip()
        print("---------OrderView-get----------")
        print(request.data)
        trade_no = request.data.trade_no
        alipay = create_alipay()
        result = alipay.api_alipay_trade_query(out_trade_no=trade_no)
        print(result)
        if result:
            try:
                order=OrderInfo.objects.get(pk=trade_no)
            except:
                order.pay_status = 'unpaid'
                return Response({'pay_status': 'failed1'})

            order.pay_status = 'success'
            order.save()
            return Response({'pay_status': 'success'})

        return Response({'pay_status': 'failed2'})


    def post(self, request):
        server_ip = get_server_ip()
        print("---------OrderView-post----------")
        user = request.user
        if user.is_authenticated:
            # 不允许同一个用户提交同一场考试的信息
            # 如果数据库里存在一个相同id的考试订单，显示支付成功
            # 那么不能再次提交报名考试信息

            # 创建订单
            serializer = OrderInfoSerializer(data=request.data, context={
                "request": self.request,
            })
            if serializer.is_valid():
                print('order valid')
                order = serializer.save()
                print(order.trade_no)
                alipay = create_alipay()

                #alipay = create_alipay()

                total_amount = 25
                pay_url =  get_alipay_url(alipay, total_amount, trade_no=order.trade_no)

                return Response(data = {'pay_url': pay_url, 'trade_no': order.trade_no})

        return Response(status=status.HTTP_400_BAD_REQUEST)

# 支付宝跨域请求

class AliPayAPI(APIView):
    # return url GET
    permission_classes = (permissions.AllowAny,)
    @csrf_exempt
    def get(self, request):
        alipay = create_alipay()
        print("---------AliPayAPI-get----------")

        
        params = request.GET.dict()
        sign = params.pop('sign', None)

        #alipay = create_alipay()
        verify_result = alipay.verify(params, sign)
        if verify_result:
            return Response('success')

    # notify url
    @csrf_exempt
    def post(self,request):
        alipay = create_alipay()
        print("---------AliPayAPI-post----------")
        from urllib.parse import parse_qs
        body_str = request.body.decode('utf-8')
        post_data = parse_qs(body_str)
        post_dict = {}
        for k, v in post_data.items():
            post_dict[k] = v[0]

        sign = post_dict.pop('sign', None)

        verify_result = alipay.verify(post_dict, sign)
        if verify_result:
            out_trade_no = post_dict.get('out_trade_no')
            trade_status = post_dict.get('trade_status')
            print(datetime.now())
            OrderInfo.objects.filter(trade_no=out_trade_no).update(
                pay_status = trade_status,
                pay_time = datetime.now(),
            )

        # 给支付宝服务器返回，表明已经收到异步通知
        return Response('success')
