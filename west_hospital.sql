/*
 Navicat Premium Dump SQL

 Source Server         : one
 Source Server Type    : MySQL
 Source Server Version : 80039 (8.0.39)
 Source Host           : localhost:3306
 Source Schema         : west_hospital

 Target Server Type    : MySQL
 Target Server Version : 80039 (8.0.39)
 File Encoding         : 65001

 Date: 02/09/2024 00:14:56
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for fill_in
-- ----------------------------
DROP TABLE IF EXISTS `fill_in`;
CREATE TABLE `fill_in`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `form_id` int NOT NULL COMMENT '关联表单模板id',
  `form_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `written_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '填写人',
  `written_account` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '填写人账号',
  `date` datetime NOT NULL,
  `state` int NOT NULL COMMENT '四种状态 1：待校验  2：校验正确  3：错误  4: 未校验',
  `verify` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '表单内容里面校验值组合',
  `verify_correct` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '表单内容里面每一项是否正确，不正确前端标红，结构与content结构一样,false为错误项',
  `user_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '表单内容里面第一项，人员id',
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`, `form_id` DESC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 72 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of fill_in
-- ----------------------------

-- ----------------------------
-- Table structure for form_list
-- ----------------------------
DROP TABLE IF EXISTS `form_list`;
CREATE TABLE `form_list`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `creator` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建人',
  `creat_date` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  `table_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `verify_correct` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '校验初始信息，都为false',
  `check_number` int NOT NULL COMMENT '校验项的数量，不小于3',
  `state` int NOT NULL DEFAULT 0 COMMENT '0为关闭，1为开启',
  `filled` int NOT NULL DEFAULT 0 COMMENT '0为没开放过填写 可以编辑，1为开放过填写 不可以编辑',
  `permissions` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '填写权限，设置哪些人可以填写，存储account',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 18 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of form_list
-- ----------------------------

-- ----------------------------
-- Table structure for logs
-- ----------------------------
DROP TABLE IF EXISTS `logs`;
CREATE TABLE `logs`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `account` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `controls` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `controls_date` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 165 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of logs
-- ----------------------------
INSERT INTO `logs` VALUES (164, '管理员', 'admin', '登录', '2024-09-02 00:01:31');

-- ----------------------------
-- Table structure for notice
-- ----------------------------
DROP TABLE IF EXISTS `notice`;
CREATE TABLE `notice`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `publisher` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `publisher_account` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '详情内容',
  `have_read` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '已读的人',
  `date` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of notice
-- ----------------------------
INSERT INTO `notice` VALUES (2, '管理员', 'admin', '9996', NULL, '2024-08-30 10:37:05');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `account` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `power` tinyint NOT NULL COMMENT '为1时是管理员，0时是普通用户',
  `roles` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '页面权限',
  `create_date` timestamp NOT NULL,
  PRIMARY KEY (`account`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('111', '111', '111', '14708267611', 0, '[\'自定义表单\',\'表单列表\',\'表单填写\',\'公告\']', '2024-08-30 11:45:20');
INSERT INTO `user` VALUES ('123', '123', 'wh', '14705253625', 0, '[\'自定义表单\',\'表单列表\',\'表单填写\']', '2024-08-25 04:13:03');
INSERT INTO `user` VALUES ('999', '999', '杰', '14708267688', 0, '[\'自定义表单\',\'表单列表\',\'表单填写\',\'公告\']', '2024-08-31 00:55:23');
INSERT INTO `user` VALUES ('admin', 'admin', '管理员', '14536253625', 1, 'admin', '2024-08-24 02:13:07');

SET FOREIGN_KEY_CHECKS = 1;
