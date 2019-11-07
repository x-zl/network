from .alipay import AliPay
from trade.settings import ALIPAY_APPID, APP_PRIVATE_KEY_PATH, ALIPAY_PUBLIC_KEY_PATH, ALIPAY_DEBUG, ALIPAY_URL
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
    prefix = '3298103822'
    trade_no = "{prefix}{exam_number}{userid}".format(prefix=prefix, exam_number=exam_number,
        userid=user_id)
    return trade_no
