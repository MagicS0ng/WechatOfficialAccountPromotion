# PRE

- token: kris
- EncodingAESKey: fp2eEbuul1cKqd8HOHKgMBbpWWJHbX0cVDgx6riwbYD

在微信公众号增加一级菜单，实现以下需求

# 需求

1. 购买智能锁后，登记
2. 登记后的用户拥有一个自己独一无二的二维码，用户通过自己的二维码推广一定人数购买智能锁，得到返现
3. 用户在购买智能锁的一定时间内才能推广，超出这个时间的推广无效

# 实现

1. 公众号界面，一级菜单，推广
2. 点击推广，跳转到登记页面，通过微信 api 授权，获取用户的信息，
3. 用户点击后应检测用户是否已经登记，未登记则跳转到登记页面，已登记则跳转到用户的推广页面，
4. 推广页面应显示当前用户的唯一推广二维码，目前已推广人数，可提现金额，提现过期时间，申请提现的按钮，提现记录
5. 用户未登记，输入手机号，智能锁的安装回执单号，以及安装时间，使用数据库用户信息表存储用户 id，手机号,openid 用户的安装回执，用户的智能锁的安装日期，以及提交日期，提交时检查信息是否在数据库中已存在，已存在提示用户核实信息，不存在则信息入库，提示用户登记成功，跳转到推广页面；用户登记成功后，在数据库推广表增加该用户的信息，推广表应有用户的 id，推广人数
6. 用户已登记，跳转到推广页面
7. 其他用户扫描该用户的推广二维码，并填写安装回执，视为本次推广成功，该用户的推广人数+1，
8. 推广成功后，该用户可以申请提现，提现成功后，该用户可以查看提现记录，提现记录中应显示提现时间，提现金额，提现状态，提现状态包括：待审核，已通过，已拒绝，已打款，已过期
CNS/
├── config/
|   ├── config.js
|   └── database.js
├── controllers/
│   ├── promotionController.js
│   ├── submitController.js
│   ├── wechatController.js
│   └── withdrawalController.js
├── middleware/
├── models
│   ├── admin.js
|   ├── init.js
|   ├── permission.js
|   ├── role.js
|   ├── rolepermission.js
│   └── submission.js
├── public/
│   ├── css/
|   ├── js/
|   ├── form.html
|   ├── promotion.html
│   └── promotioninfo.html
├── services/
│   ├── submitService.js
|   ├── wechatService.js
│   └── withdrawlsService.js
├── app.js
├── package-lock.json
└── package.json