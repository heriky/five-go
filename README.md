# five-go
基于React.js 和 socket.io的简易双人网络版五子棋。

## 1.安装

npm install

## 2.快速开始

npm start

## 3.说明

基于[官方实例](https://facebook.github.io/react/tutorial/tutorial.html)进行了如下改进:

+ 改进判定输赢的算法，以支持更大的棋盘。
+ 支持自定义棋盘大小。
+ 通过socket.io添加网络功能，可进行双方对弈。

## 4.待改进

+ 添加用户系统，用户可选择棋子类型，非己方回合限制用户操作。
+ 只支持双方对弈，第三方打开同一网页只能进行观战。
+ 友好的提示：游戏结束、用户名选择、棋子类型选择。

