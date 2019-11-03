from django.shortcuts import render, redirect, HttpResponse
from alipay import AliPay
import json
import time
from enrollmentSystem import models

def index(request):
    return render(request,'index.html')

def page1(request):
    money = float(25)
    user = request.user
    if not user.is_authenticated:
       return HttpResponse("errmsg: 用户未登录")
    profile = user.profile
    if profile.pay_status:
        print(profile.pay_status)
        return HttpResponse("已支付过")
    alipay = AliPay(
        appid="2016101500693869",
        app_notify_url="http://47.100.162.64:8000/page2/",
        app_private_key_path="keys/app_private_2048.txt",
        alipay_public_key_path="keys/alipay_public_2048.txt",
        sign_type="RSA2",
        debug=True
    )
    total_pay = 25
    # 生成支付的url
    order_id = str(time.time())
    profile.pay_num = order_id
    profile.save()
    order_string = alipay.api_alipay_trade_page_pay(
            out_trade_no=order_id,  #订单id
            total_amount=str(total_pay), #支付宝总金额
            subject="networkTestPay", #订单标题
            return_url="http://47.100.162.64:8000/page3/",
            notify_url="http://47.100.162.64:8000/page2/"
        )

    pay_url = "https://openapi.alipaydev.com/gateway.do?"+order_string

    return redirect(pay_url)


def page2(request):
    alipay = AliPay(
        appid="2016101500693869",
        app_notify_url="http://47.100.162.64:8000/page2/",
        app_private_key_path="keys/app_private_2048.txt",
        alipay_public_key_path="keys/alipay_public_2048.txt",
        sign_type="RSA2",
        debug=True
    )
    user = request.user
    
    if request.method == "POST":
        print('------------------开始------------------')
        
        from urllib.parse import parse_qs
        body_str = request.body.decode('utf-8')
        post_data = parse_qs(body_str)
        post_dict = {}
        for k, v in post_data.items():
            post_dict[k] = v[0]

        sign = post_dict.pop('sign', None)
        status = alipay.verify(post_dict, sign)
        print('POST验证', status)
        print(post_dict)
        out_trade_no = post_dict['out_trade_no']
        models.Profile.objects.filter(pay_num=out_trade_no).update(pay_status=status)
        # 修改订单状态
        # 
        print('------------------结束------------------')
        # 修改订单状态：获取订单号
        return HttpResponse('POST返回')

def page3(request):
    user = request.user
    if not user.is_authenticated:
       return HttpResponse("errmsg: 用户未登录")
    profile = request.user.profile

    alipay = AliPay(
        appid="2016101500693869",
        app_notify_url="http://47.100.162.64:8000/page2/",
        app_private_key_path="keys/app_private_2048.txt",
        alipay_public_key_path="keys/alipay_public_2048.txt",
        sign_type="RSA2",
        debug=True
    )
    params = request.GET.dict()
    sign = params.pop('sign', None)
    status = alipay.verify(params, sign)
    
    profile.pay_status = status
    profile.save()
    print('==================开始==================')
    print('GET验证', status)
    print('==================结束==================')
    return HttpResponse('支付成功')


