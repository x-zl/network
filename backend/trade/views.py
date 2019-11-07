from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from rest_framework import permissions, status

from .settings import ALIPAY_APPID, APP_PRIVATE_KEY_PATH, ALIPAY_PUBLIC_KEY_PATH, ALIPAY_DEBUG, ALIPAY_URL
from .models import OrderInfo, ExamInfo
from .serializers import OrderInfoSerializer, examInfoSerializer
from .utils.tools import get_server_ip, create_alipay, get_alipay_url, generate_trade_no

# Create your views here.
class OrderView(APIView):
    # permission_classes = (IsAuthenticated, )

    # 查询订单状况
    def get(self, request):
        user = request.user
        if user.is_authenticated == False:
            return Response(data={'errmsg': 'invalid user'}, status=status.HTTP_400_BAD_REQUEST)

        server_ip = get_server_ip()
        print("---------OrderView-get----------")
        # request.data
        print('userid', request.user.id)
        params = request.query_params.dict()
        print('send data', params)
        exam_number = params.get('exam_number', None)
        if exam_number == None:
            return Response({'pay_status': 'no exam_number'}, status=HTTP_400_BAD_REQUEST)

        trade_no = generate_trade_no(request.user.id, exam_number)

        alipay = create_alipay()
        result = alipay.api_alipay_trade_query(out_trade_no=trade_no)
        print("====trade_no====")
        print(trade_no)
        if result:
            print("---in-result---")
            try:
                order=OrderInfo.objects.get(trade_no=trade_no)
                print("---in-try---")
            except:
                print("---in-except---")
                return Response({'pay_status': 'invalid trade_no', 'finished': 'false'})
            # if order.pay_status = 'success':

            return Response({'pay_status': order.pay_status,
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
            if serializer.is_valid():
                order = serializer.save()
                print('order valid', order.trade_no)

                alipay = create_alipay()
                total_amount = 25
                pay_url =  get_alipay_url(alipay, total_amount, trade_no=order.trade_no)

                return Response(data = {'pay_url': pay_url, 'trade_no': order.trade_no})

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(data={'errmsg': 'invalid user'}, status=status.HTTP_400_BAD_REQUEST)

# accounts/current_users for did mount
@api_view(['GET'])
def exam_info(request):
    user = request.user
    if not user.is_authenticated:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    print('userid', request.user.id)
    params = request.query_params.dict()
    print('send data', params)
    exam_number = params.get('exam_number', None)
    if exam_number == None:
        return Response({'pay_status': 'no exam_number'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        examInfo = ExamInfo.objects.get(user=request.user, exam_number=exam_number)
        print(examInfo)
        print("---in-try----")
    except:
        print("---in-except----")
        return Response(status=status.HTTP_400_BAD_REQUEST)


    serializer = examInfoSerializer(examInfo)
    print("---serializer.data---")
    print(examInfo)
    print(serializer.data)
    return Response(serializer.data)
    return Response(serializers.errors, status=HTTP_400_BAD_REQUEST)




# 支付宝跨域请求
class AliPayAPI(APIView):

    permission_classes = (permissions.AllowAny,)

    # return url GET
    @csrf_exempt
    def get(self, request):
        alipay = create_alipay()
        print("---------AliPayAPI-get----------")
        params = request.GET.dict()
        sign = params.pop('sign', None)
        verify_result = alipay.verify(params, sign)
        if verify_result:
            return Response('success')

    # notify url
    @csrf_exempt
    def post(self, request):
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
            print(trade_status)
            #verify_result为真就一定完成

            # 修改订单状态为已完成 两个表一起应该是原子操作
            order = OrderInfo.objects.get(trade_no=out_trade_no)
            order.pay_status = 'success'
            order.pay_time = datetime.now()
            order.save()
            # 考试类型
            exam_number = order.exam_number
            STUDENT_NUMBER_PER_CLASS = 30
            # 生成一条考生相关考试记录
            user = order.user
            profile = user.profile

            # 同考场的总人数
            total_student = ExamInfo.objects.filter(exam_number=exam_number).count()
            # 考生序号
            student_id = total_student % 30 + 1
            # 考场号
            class_number = total_student / 30 + 1
            if ExamInfo.objects.filter(user=user,exam_number=exam_number).count() != 0:
                return Response('success')
            # 考号 时间
            exa_number = "0"
            if(exam_number == "四级"):
                exa_number = "1"
            if(exam_number == "六级"):
                exa_number = "2"
            if(exam_number == "计算机等级考试"):
                exa_number = "3"
            exam_id = str(datetime.now().year)+str(exa_number)+('%04d' % class_number)+('%03d' % student_id)
            ExamInfo.objects.create(
                user = user,
                name = profile.name,
                IDCard = profile.IDCard,
                student_id = student_id,
                class_number = class_number,
                exam_id = exam_id,
                exam_number = exam_number,
            )

        # 给支付宝服务器返回，表明已经收到异步通知
        return Response('success')

class ExamAPI(APIView):
    def get(self, request, **kwargs):
        user = request.user
        # serializer = UserSerializer(user)
        if user.is_authenticated:
            exams = ExamInfo.objects.filter(user=user)
            exams_serializer = ExamSerializer(exams, many=True)
            return Response(exams_serializer.data)
        return Response(status=status.HTTP_400_BAD_REQUEST)
