from .utils.alipay import AliPay
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from rest_framework import permissions

from .settings import ALIPAY_APPID, APP_PRIVATE_KEY_PATH, ALIPAY_PUBLIC_KEY_PATH, ALIPAY_DEBUG, ALIPAY_URL
from .models import OrderInfo, ExamInfo
from enrollmentSystem.models import Profile
from .serializers import OrderInfoSerializer, ExamSerializer

def get_server_ip():
    return '47.100.162.64'

def create_alipay():
    server_ip = get_server_ip()
    alipay = AliPay(
        appid = ALIPAY_APPID,
        app_notify_url = "http://47.100.162.64:8000/alipayreturn/",
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
        return_url="http://{}:8000/alipayreturn/".format(server_ip),
        notify_url="http://47.100.162.64:8000/alipayreturn/"
    )
    print('---get_url---')
    print(order_string)
    return ALIPAY_URL+order_string


def generate_trade_no(user_id, exam_number):
    suffix = '329810382'
    trade_no = "329810382{userid}.{exam_number}".format(suffix=suffix, userid=user_id,exam_number=exam_number)
    print(trade_no)
    return trade_no

# Create your views here.
class OrderView(APIView):
    # permission_classes = (IsAuthenticated, )

    def get(self, request):
        server_ip = get_server_ip()
        print("---------OrderView-get----------")
        print('data', request.data)
        print('userid', request.user.id)
        exam_number = request.data.get('exam_number', None)
        if exam_number == None:
            return Response({'pay_status': 'no exam_number'}, status=HTTP_400_BAD_REQUEST)

        trade_no = generate_trade_no(request.user.id, exam_number)

        alipay = create_alipay()
        result = alipay.api_alipay_trade_query(out_trade_no=trade_no)
        print(result)
        if result:
            try:
                order=OrderInfo.objects.get(pk=trade_no)
            except:
                return Response({'pay_status': 'invalid trade_no', 'finished': 'false'})

            try:
                profile=Profile.objects.get(user=request.user);
            except:
                return Response({'pay_status': 'cannot find profile', 'finished': 'false'})

            order.pay_status = 'success'
            # 生成考场号
            
            order.save()
            
            return Response({'pay_status': 'success',
                            'student_id': "{0}{1}".format(exam_number ,str(profile.IDCard)),
                            'finished': 'true'})

        return Response({'pay_status': 'failed2', 'finished': 'false'})


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
            #print(serializer)
            
            if serializer.is_valid():
                print('order--exam_number')
                order = serializer.save()
                tmmp = order.exam_number
                print(tmmp)
                order.trade_no = generate_trade_no(user.id,tmmp)
                order.save()
                print('order--trade_no')
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
        print(post_dict)
        verify_result = alipay.verify(post_dict, sign)
        if verify_result:
            out_trade_no = post_dict.get('out_trade_no')
            trade_status = post_dict.get('trade_status')
            try:
                tmp = OrderInfo.objects.get(trade_no=out_trade_no)
            except:
                pass
            print("tmp.trade_no" + tmp.trade_no)
            try:
                profile = Profile.objects.get(user=tmp.user)
            except:
                pass
            print("profile name:"+profile.name)
            #print(datetime.now())
            print("------post-end3------")
            OrderInfo.objects.filter(trade_no=out_trade_no).update(
                pay_status = trade_status,
                pay_time = datetime.now(),
            )
            
            #根据订单号将考生信息放入考试表中
            if ExamInfo.objects.filter(ex_type=out_trade_no.split('.')[1]).count() == 0:
                try:
                    typ = out_trade_no.split('.')[1]
                    idd = "160023"+typ+"0010001"
                    print(typ,idd)
                    user = profile.user
                    ExamInfo.objects.create(user=user,name=profile.name,stu_id=1,ex_id=idd,
                                            ex_addr=1,ex_type=typ,grade=0)
                except:
                    pass
                print("----in-if-----")
                #print(ExamInfo.objects.filter(ex_type=out_trade_no.split('.')[1]).latest('stu_id').ex_id)
            else:
                b=ExamInfo.objects.filter(ex_type=out_trade_no.split('.')[1]).latest('stu_id')
                num = b.stu_id + 1
                addr = num / 30 + 1
                typ = out_trade_no.split('.')[1]
                s = '%04d' % num
                e = '%03d' % addr
                idd = "160023"+out_trade_no.split('.')[1]+e+s
                try:
                    ExamInfo.objects.create(user=user,name=profile.name,stu_id=num,ex_id=idd,
                                            ex_addr=addr,ex_type=typ,grade=0)
                except:
                    pass
                
                print("----in-else----")
                #print(ExamInfo.objects.filter(ex_type=out_trade_no.split('.')[1]).latest('stu_id').ex_id)
                
            
            print("------post-end2------")
        print("------post-end------")
        # 给支付宝服务器返回，表明已经收到异步通知
        return Response('success')

class ExamAPI(APIView):
    def get(self, request, **kwargs):
        klog(__name__)
        user = request.user

        # serializer = UserSerializer(user)
        if user.is_authenticated:
            exam_data = ExamInfo.objects.filter(user=user)
            klog('authenticated', exam_data)
            exam_serializer = ExamSerializer(exam_data)
            return Response(exam_serializer.data)
        return Response(status=status.HTTP_400_BAD_REQUEST)
