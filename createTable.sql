use smartlock;
create table users
(
    id                int auto_increment comment '标识用户的id'
        primary key,
    openid            varchar(255)                        not null comment 'openid',
    phone             varchar(20)                         null comment '用户手机号',
    nickname          varchar(199)                        not null comment '用户id',
    receipt           varchar(255)                        not null comment '安装回执',
    installation_date date                                not null comment '安装日期',
    expire_at         date                                not null comment '提现过期时间',
    submitted_at      timestamp default CURRENT_TIMESTAMP not null comment '提交的事件',
    constraint openid
        unique (openid),
    constraint phone
        unique (phone),
    constraint receipt
        unique (receipt)
);


CREATE TABLE promotions
(
    id                   INT AUTO_INCREMENT PRIMARY KEY,
    user_id              INT  NOT NULL,
    promotion_count      INT            DEFAULT 0,
    withdrawable_amount  DECIMAL(10, 2) DEFAULT 0,
    withdraw_expiry_date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE withdrawals
(
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT                                                         NOT NULL,
    amount          DECIMAL(10, 2)                                              NOT NULL,
    withdrawal_date DATE                                                        NOT NULL,
    status          ENUM ('pending', 'approved', 'rejected', 'paid', 'expired') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE promotion_records
(
    id                INT AUTO_INCREMENT PRIMARY KEY,
    promoter_id       INT          NOT NULL,
    promoted_phone    VARCHAR(15)  NOT NULL,
    receipt           VARCHAR(255) NOT NULL UNIQUE,
    installation_date DATE         NOT NULL,
    promotion_date    DATE         NOT NULL,
    FOREIGN KEY (promoter_id) REFERENCES users (id),
);
