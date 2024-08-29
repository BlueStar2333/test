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

 Date: 30/08/2024 03:45:39
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
  `state` int NOT NULL COMMENT '三种状态 1：待校验  2：校验正确  3：错误  4: 未校验',
  `verify` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '表单内容里面校验值组合',
  `verify_correct` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '表单内容里面每一项是否正确，不正确前端标红，结构与content结构一样,false为错误项',
  `user_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '表单内容里面第一项，人员id',
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`, `form_id` DESC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 67 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of fill_in
-- ----------------------------
INSERT INTO `fill_in` VALUES (47, 13, 'tbwh', 'wh', '123', '2024-08-29 06:12:40', 1, '-21-0-选项1', '[false,[[false,false,false]],false,false,false]', '21', '[{\"type\":7,\"uniqueName\":\"\",\"label\":\"人员ID\",\"suggestion\":\"\",\"content\":\"21\",\"isNecessary\":true,\"checkValue\":true},{\"type\":20,\"uniqueName\":\"\",\"label\":\"自增表格\",\"header\":[\"列1\",\"列2\",\"列3\"],\"bodyForm\":[{\"type\":0,\"uniqueName\":\"\",\"label\":\"单行文本\",\"max\":100,\"min\":0,\"suggestion\":\"\",\"content\":\"\"},{\"type\":4,\"uniqueName\":\"\",\"label\":\"日期选择\",\"max\":100,\"min\":0,\"suggestion\":\"\",\"content\":\"\"},{\"type\":5,\"uniqueName\":\"\",\"label\":\"数量选择\",\"max\":100,\"min\":0,\"suggestion\":\"\",\"content\":\"\"}],\"content\":[[\"\",\"\",0]]},{\"type\":5,\"uniqueName\":\"\",\"label\":\"数量选择\",\"max\":10,\"min\":0,\"content\":0,\"isNecessary\":false,\"checkValue\":true},{\"type\":2,\"uniqueName\":\"\",\"label\":\"单选框\",\"select\":[\"选项1\",\"选项2\"],\"content\":\"选项1\",\"isNecessary\":true,\"checkValue\":true},{\"type\":3,\"uniqueName\":\"\",\"label\":\"多选框\",\"select\":[\"选项1\",\"选项12\",\"选项3\"],\"content\":[],\"isNecessary\":false,\"checkValue\":false}]');
INSERT INTO `fill_in` VALUES (49, 13, 'tbwh', 'wh', '123', '2024-08-29 06:14:28', 1, '-22-0-选项1', '[true,[[true,true,true]],true,true,true]', '22', '[{\"type\":7,\"uniqueName\":\"\",\"label\":\"人员ID\",\"suggestion\":\"\",\"content\":\"22\",\"isNecessary\":true,\"checkValue\":true},{\"type\":20,\"uniqueName\":\"\",\"label\":\"自增表格\",\"header\":[\"列1\",\"列2\",\"列3\"],\"bodyForm\":[{\"type\":0,\"uniqueName\":\"\",\"label\":\"单行文本\",\"max\":100,\"min\":0,\"suggestion\":\"\",\"content\":\"\"},{\"type\":4,\"uniqueName\":\"\",\"label\":\"日期选择\",\"max\":100,\"min\":0,\"suggestion\":\"\",\"content\":\"\"},{\"type\":5,\"uniqueName\":\"\",\"label\":\"数量选择\",\"max\":100,\"min\":0,\"suggestion\":\"\",\"content\":\"\"}],\"content\":[[\"\",\"\",0]]},{\"type\":5,\"uniqueName\":\"\",\"label\":\"数量选择\",\"max\":10,\"min\":0,\"content\":0,\"isNecessary\":false,\"checkValue\":true},{\"type\":2,\"uniqueName\":\"\",\"label\":\"单选框\",\"select\":[\"选项1\",\"选项2\"],\"content\":\"选项1\",\"isNecessary\":true,\"checkValue\":true},{\"type\":3,\"uniqueName\":\"\",\"label\":\"多选框\",\"select\":[\"选项1\",\"选项12\",\"选项3\"],\"content\":[],\"isNecessary\":false,\"checkValue\":false}]');
INSERT INTO `fill_in` VALUES (51, 13, 'tbwh', 'wh', '123', '2024-08-29 06:15:57', 2, '-3-0-选项2', '[true,[[true,true,true]],true,true,true]', '3', '[{\"type\":7,\"uniqueName\":\"\",\"label\":\"人员ID\",\"suggestion\":\"\",\"content\":\"3\",\"isNecessary\":true,\"checkValue\":true},{\"type\":20,\"uniqueName\":\"\",\"label\":\"自增表格\",\"header\":[\"列1\",\"列2\",\"列3\"],\"bodyForm\":[{\"type\":0,\"uniqueName\":\"\",\"label\":\"单行文本\",\"max\":100,\"min\":0,\"suggestion\":\"\",\"content\":\"\"},{\"type\":4,\"uniqueName\":\"\",\"label\":\"日期选择\",\"max\":100,\"min\":0,\"suggestion\":\"\",\"content\":\"\"},{\"type\":5,\"uniqueName\":\"\",\"label\":\"数量选择\",\"max\":100,\"min\":0,\"suggestion\":\"\",\"content\":\"\"}],\"content\":[[\"\",\"\",0]]},{\"type\":5,\"uniqueName\":\"\",\"label\":\"数量选择\",\"max\":10,\"min\":0,\"content\":0,\"isNecessary\":false,\"checkValue\":true},{\"type\":2,\"uniqueName\":\"\",\"label\":\"单选框\",\"select\":[\"选项1\",\"选项2\"],\"content\":\"选项2\",\"isNecessary\":true,\"checkValue\":true},{\"type\":3,\"uniqueName\":\"\",\"label\":\"多选框\",\"select\":[\"选项1\",\"选项12\",\"选项3\"],\"content\":[],\"isNecessary\":false,\"checkValue\":false}]');
INSERT INTO `fill_in` VALUES (52, 13, 'tbwh', 'wh', '123', '2024-08-29 06:16:12', 2, '-3-0-选项2', '[true,[[true,true,true]],true,true,true]', '3', '[{\"type\":7,\"uniqueName\":\"\",\"label\":\"人员ID\",\"suggestion\":\"\",\"content\":\"3\",\"isNecessary\":true,\"checkValue\":true},{\"type\":20,\"uniqueName\":\"\",\"label\":\"自增表格\",\"header\":[\"列1\",\"列2\",\"列3\"],\"bodyForm\":[{\"type\":0,\"uniqueName\":\"\",\"label\":\"单行文本\",\"max\":100,\"min\":0,\"suggestion\":\"\",\"content\":\"\"},{\"type\":4,\"uniqueName\":\"\",\"label\":\"日期选择\",\"max\":100,\"min\":0,\"suggestion\":\"\",\"content\":\"\"},{\"type\":5,\"uniqueName\":\"\",\"label\":\"数量选择\",\"max\":100,\"min\":0,\"suggestion\":\"\",\"content\":\"\"}],\"content\":[[\"\",\"\",0]]},{\"type\":5,\"uniqueName\":\"\",\"label\":\"数量选择\",\"max\":10,\"min\":0,\"content\":0,\"isNecessary\":false,\"checkValue\":true},{\"type\":2,\"uniqueName\":\"\",\"label\":\"单选框\",\"select\":[\"选项1\",\"选项2\"],\"content\":\"选项2\",\"isNecessary\":true,\"checkValue\":true},{\"type\":3,\"uniqueName\":\"\",\"label\":\"多选框\",\"select\":[\"选项1\",\"选项12\",\"选项3\"],\"content\":[],\"isNecessary\":false,\"checkValue\":false}]');
INSERT INTO `fill_in` VALUES (53, 13, 'tbwh', 'wh', '123', '2024-08-29 06:19:39', 3, '-36-0-选项1', '[true,[[false,true,true]],true,true,true]', '36', '[{\"type\":7,\"uniqueName\":\"\",\"label\":\"人员ID\",\"suggestion\":\"\",\"content\":\"36\",\"isNecessary\":true,\"checkValue\":true},{\"type\":20,\"uniqueName\":\"\",\"label\":\"自增表格\",\"header\":[\"列1\",\"列2\",\"列3\"],\"bodyForm\":[{\"type\":0,\"uniqueName\":\"\",\"label\":\"单行文本\",\"max\":100,\"min\":0,\"suggestion\":\"\",\"content\":\"\"},{\"type\":4,\"uniqueName\":\"\",\"label\":\"日期选择\",\"max\":100,\"min\":0,\"suggestion\":\"\",\"content\":\"\"},{\"type\":5,\"uniqueName\":\"\",\"label\":\"数量选择\",\"max\":100,\"min\":0,\"suggestion\":\"\",\"content\":\"\"}],\"content\":[[\"\",\"\",0]]},{\"type\":5,\"uniqueName\":\"\",\"label\":\"数量选择\",\"max\":10,\"min\":0,\"content\":0,\"isNecessary\":false,\"checkValue\":true},{\"type\":2,\"uniqueName\":\"\",\"label\":\"单选框\",\"select\":[\"选项1\",\"选项2\"],\"content\":\"选项1\",\"isNecessary\":true,\"checkValue\":true},{\"type\":3,\"uniqueName\":\"\",\"label\":\"多选框\",\"select\":[\"选项1\",\"选项12\",\"选项3\"],\"content\":[],\"isNecessary\":false,\"checkValue\":false}]');
INSERT INTO `fill_in` VALUES (54, 13, 'tbwh', 'wh', '123', '2024-08-29 06:19:44', 3, '-36-0-选项1', '[true,[[false,true,true]],true,true,true]', '36', '[{\"type\":7,\"uniqueName\":\"\",\"label\":\"人员ID\",\"suggestion\":\"\",\"content\":\"36\",\"isNecessary\":true,\"checkValue\":true},{\"type\":20,\"uniqueName\":\"\",\"label\":\"自增表格\",\"header\":[\"列1\",\"列2\",\"列3\"],\"bodyForm\":[{\"type\":0,\"uniqueName\":\"\",\"label\":\"单行文本\",\"max\":100,\"min\":0,\"suggestion\":\"\",\"content\":\"\"},{\"type\":4,\"uniqueName\":\"\",\"label\":\"日期选择\",\"max\":100,\"min\":0,\"suggestion\":\"\",\"content\":\"\"},{\"type\":5,\"uniqueName\":\"\",\"label\":\"数量选择\",\"max\":100,\"min\":0,\"suggestion\":\"\",\"content\":\"\"}],\"content\":[[\"6\",\"\",0]]},{\"type\":5,\"uniqueName\":\"\",\"label\":\"数量选择\",\"max\":10,\"min\":0,\"content\":0,\"isNecessary\":false,\"checkValue\":true},{\"type\":2,\"uniqueName\":\"\",\"label\":\"单选框\",\"select\":[\"选项1\",\"选项2\"],\"content\":\"选项1\",\"isNecessary\":true,\"checkValue\":true},{\"type\":3,\"uniqueName\":\"\",\"label\":\"多选框\",\"select\":[\"选项1\",\"选项12\",\"选项3\"],\"content\":[],\"isNecessary\":false,\"checkValue\":false}]');
INSERT INTO `fill_in` VALUES (55, 13, 'tbwh', 'wh', '123', '2024-08-29 07:10:16', 1, '-35-0-选项1', '[false,[[false,false,false]],false,false,false]', '35', '[{\"type\":7,\"uniqueName\":\"\",\"label\":\"人员ID\",\"suggestion\":\"\",\"content\":\"35\",\"isNecessary\":true,\"checkValue\":true},{\"type\":20,\"uniqueName\":\"\",\"label\":\"自增表格\",\"header\":[\"列1\",\"列2\",\"列3\"],\"bodyForm\":[{\"type\":0,\"uniqueName\":\"\",\"label\":\"单行文本\",\"max\":100,\"min\":0,\"suggestion\":\"\",\"content\":\"\"},{\"type\":4,\"uniqueName\":\"\",\"label\":\"日期选择\",\"max\":100,\"min\":0,\"suggestion\":\"\",\"content\":\"\"},{\"type\":5,\"uniqueName\":\"\",\"label\":\"数量选择\",\"max\":100,\"min\":0,\"suggestion\":\"\",\"content\":\"\"}],\"content\":[[\"\",\"\",0]]},{\"type\":5,\"uniqueName\":\"\",\"label\":\"数量选择\",\"max\":10,\"min\":0,\"content\":0,\"isNecessary\":false,\"checkValue\":true},{\"type\":2,\"uniqueName\":\"\",\"label\":\"单选框\",\"select\":[\"选项1\",\"选项2\"],\"content\":\"选项1\",\"isNecessary\":true,\"checkValue\":true},{\"type\":3,\"uniqueName\":\"\",\"label\":\"多选框\",\"select\":[\"选项1\",\"选项12\",\"选项3\"],\"content\":[],\"isNecessary\":false,\"checkValue\":false}]');
INSERT INTO `fill_in` VALUES (56, 13, 'tbwh', 'wh', '123', '2024-08-29 07:11:00', 1, '-35-0-选项1', '[false,[[false,false,false]],false,false,false]', '35', '[{\"type\":7,\"uniqueName\":\"\",\"label\":\"人员ID\",\"suggestion\":\"\",\"content\":\"35\",\"isNecessary\":true,\"checkValue\":true},{\"type\":20,\"uniqueName\":\"\",\"label\":\"自增表格\",\"header\":[\"列1\",\"列2\",\"列3\"],\"bodyForm\":[{\"type\":0,\"uniqueName\":\"\",\"label\":\"单行文本\",\"max\":100,\"min\":0,\"suggestion\":\"\",\"content\":\"\"},{\"type\":4,\"uniqueName\":\"\",\"label\":\"日期选择\",\"max\":100,\"min\":0,\"suggestion\":\"\",\"content\":\"\"},{\"type\":5,\"uniqueName\":\"\",\"label\":\"数量选择\",\"max\":100,\"min\":0,\"suggestion\":\"\",\"content\":\"\"}],\"content\":[[\"\",\"2024-08-04T16:00:00.000Z\",0]]},{\"type\":5,\"uniqueName\":\"\",\"label\":\"数量选择\",\"max\":10,\"min\":0,\"content\":0,\"isNecessary\":false,\"checkValue\":true},{\"type\":2,\"uniqueName\":\"\",\"label\":\"单选框\",\"select\":[\"选项1\",\"选项2\"],\"content\":\"选项1\",\"isNecessary\":true,\"checkValue\":true},{\"type\":3,\"uniqueName\":\"\",\"label\":\"多选框\",\"select\":[\"选项1\",\"选项12\",\"选项3\"],\"content\":[],\"isNecessary\":false,\"checkValue\":false}]');
INSERT INTO `fill_in` VALUES (57, 13, 'tbwh', 'wh', '123', '2024-08-30 00:27:20', 1, '-333-0-选项1', '[true,false,true,true,true]', '333', '[{\"type\":7,\"uniqueName\":\"\",\"label\":\"人员ID\",\"suggestion\":\"\",\"content\":\"333\",\"isNecessary\":true,\"checkValue\":true},{\"type\":20,\"uniqueName\":\"\",\"label\":\"自增表格\",\"header\":[\"列1\",\"列2\",\"列3\"],\"bodyForm\":[{\"type\":0,\"uniqueName\":\"\",\"label\":\"单行文本\",\"max\":100,\"min\":0,\"suggestion\":\"\",\"content\":\"\"},{\"type\":4,\"uniqueName\":\"\",\"label\":\"日期选择\",\"max\":100,\"min\":0,\"suggestion\":\"\",\"content\":\"\"},{\"type\":5,\"uniqueName\":\"\",\"label\":\"数量选择\",\"max\":100,\"min\":0,\"suggestion\":\"\",\"content\":\"\"}],\"content\":[[\"7\",\"2024-08-06T16:00:00.000Z\",0],[\"\",\"\",0]]},{\"type\":5,\"uniqueName\":\"\",\"label\":\"数量选择\",\"max\":10,\"min\":0,\"content\":0,\"isNecessary\":false,\"checkValue\":true},{\"type\":2,\"uniqueName\":\"\",\"label\":\"单选框\",\"select\":[\"选项1\",\"选项2\"],\"content\":\"选项1\",\"isNecessary\":true,\"checkValue\":true},{\"type\":3,\"uniqueName\":\"\",\"label\":\"多选框\",\"select\":[\"选项1\",\"选项12\",\"选项3\"],\"content\":[],\"isNecessary\":false,\"checkValue\":false}]');
INSERT INTO `fill_in` VALUES (58, 13, 'tbwh', 'wh', '123', '2024-08-30 00:24:04', 1, '-99-0-选项1', '[false,[[true,true,true],[true,true,true]],true,true,true]', '99', '[{\"type\":7,\"uniqueName\":\"\",\"label\":\"人员ID\",\"suggestion\":\"\",\"content\":\"99\",\"isNecessary\":true,\"checkValue\":true},{\"type\":20,\"uniqueName\":\"\",\"label\":\"自增表格\",\"header\":[\"列1\",\"列2\",\"列3\"],\"bodyForm\":[{\"type\":0,\"uniqueName\":\"\",\"label\":\"单行文本\",\"max\":100,\"min\":0,\"suggestion\":\"\",\"content\":\"\"},{\"type\":4,\"uniqueName\":\"\",\"label\":\"日期选择\",\"max\":100,\"min\":0,\"suggestion\":\"\",\"content\":\"\"},{\"type\":5,\"uniqueName\":\"\",\"label\":\"数量选择\",\"max\":100,\"min\":0,\"suggestion\":\"\",\"content\":\"\"}],\"content\":[[\"7\",\"2024-08-06T16:00:00.000Z\",0],[\"\",\"\",0]]},{\"type\":5,\"uniqueName\":\"\",\"label\":\"数量选择\",\"max\":10,\"min\":0,\"content\":0,\"isNecessary\":false,\"checkValue\":true},{\"type\":2,\"uniqueName\":\"\",\"label\":\"单选框\",\"select\":[\"选项1\",\"选项2\"],\"content\":\"选项1\",\"isNecessary\":true,\"checkValue\":true},{\"type\":3,\"uniqueName\":\"\",\"label\":\"多选框\",\"select\":[\"选项1\",\"选项12\",\"选项3\"],\"content\":[],\"isNecessary\":false,\"checkValue\":false}]');
INSERT INTO `fill_in` VALUES (60, 13, 'tbwh', 'wh', '123', '2024-08-30 01:54:44', 2, '-57-0-选项1', '[true,[[true,true,true]],true,true,true]', '57', '[{\"type\":7,\"uniqueName\":\"\",\"label\":\"人员ID\",\"suggestion\":\"\",\"content\":\"57\",\"isNecessary\":true,\"checkValue\":true},{\"type\":20,\"uniqueName\":\"\",\"label\":\"自增表格\",\"header\":[\"列1\",\"列2\",\"列3\"],\"bodyForm\":[{\"type\":0,\"uniqueName\":\"\",\"label\":\"单行文本\",\"max\":100,\"min\":0,\"suggestion\":\"\",\"content\":\"\"},{\"type\":4,\"uniqueName\":\"\",\"label\":\"日期选择\",\"max\":100,\"min\":0,\"suggestion\":\"\",\"content\":\"\"},{\"type\":5,\"uniqueName\":\"\",\"label\":\"数量选择\",\"max\":100,\"min\":0,\"suggestion\":\"\",\"content\":\"\"}],\"content\":[[\"6\",\"\",0]]},{\"type\":5,\"uniqueName\":\"\",\"label\":\"数量选择\",\"max\":10,\"min\":0,\"content\":0,\"isNecessary\":false,\"checkValue\":true},{\"type\":2,\"uniqueName\":\"\",\"label\":\"单选框\",\"select\":[\"选项1\",\"选项2\"],\"content\":\"选项1\",\"isNecessary\":true,\"checkValue\":true},{\"type\":3,\"uniqueName\":\"\",\"label\":\"多选框\",\"select\":[\"选项1\",\"选项12\",\"选项3\"],\"content\":[],\"isNecessary\":false,\"checkValue\":false}]');
INSERT INTO `fill_in` VALUES (61, 13, 'tbwh', 'wh', '123', '2024-08-30 01:54:56', 2, '-57-0-选项1', '[true,[[true,true,true]],true,true,true]', '57', '[{\"type\":7,\"uniqueName\":\"\",\"label\":\"人员ID\",\"suggestion\":\"\",\"content\":\"57\",\"isNecessary\":true,\"checkValue\":true},{\"type\":20,\"uniqueName\":\"\",\"label\":\"自增表格\",\"header\":[\"列1\",\"列2\",\"列3\"],\"bodyForm\":[{\"type\":0,\"uniqueName\":\"\",\"label\":\"单行文本\",\"max\":100,\"min\":0,\"suggestion\":\"\",\"content\":\"\"},{\"type\":4,\"uniqueName\":\"\",\"label\":\"日期选择\",\"max\":100,\"min\":0,\"suggestion\":\"\",\"content\":\"\"},{\"type\":5,\"uniqueName\":\"\",\"label\":\"数量选择\",\"max\":100,\"min\":0,\"suggestion\":\"\",\"content\":\"\"}],\"content\":[[\"6\",\"\",0]]},{\"type\":5,\"uniqueName\":\"\",\"label\":\"数量选择\",\"max\":10,\"min\":0,\"content\":0,\"isNecessary\":false,\"checkValue\":true},{\"type\":2,\"uniqueName\":\"\",\"label\":\"单选框\",\"select\":[\"选项1\",\"选项2\"],\"content\":\"选项1\",\"isNecessary\":true,\"checkValue\":true},{\"type\":3,\"uniqueName\":\"\",\"label\":\"多选框\",\"select\":[\"选项1\",\"选项12\",\"选项3\"],\"content\":[],\"isNecessary\":false,\"checkValue\":false}]');
INSERT INTO `fill_in` VALUES (63, 13, 'tbwh', 'wh', '123', '2024-08-30 01:58:45', 1, '-57-0-选项2', '[true,[[false,true,true]],true,true,true]', '57', '[{\"type\":7,\"uniqueName\":\"\",\"label\":\"人员ID\",\"suggestion\":\"\",\"content\":\"57\",\"isNecessary\":true,\"checkValue\":true},{\"type\":20,\"uniqueName\":\"\",\"label\":\"自增表格\",\"header\":[\"列1\",\"列2\",\"列3\"],\"bodyForm\":[{\"type\":0,\"uniqueName\":\"\",\"label\":\"单行文本\",\"max\":100,\"min\":0,\"suggestion\":\"\",\"content\":\"\"},{\"type\":4,\"uniqueName\":\"\",\"label\":\"日期选择\",\"max\":100,\"min\":0,\"suggestion\":\"\",\"content\":\"\"},{\"type\":5,\"uniqueName\":\"\",\"label\":\"数量选择\",\"max\":100,\"min\":0,\"suggestion\":\"\",\"content\":\"\"}],\"content\":[[\"\",\"\",0]]},{\"type\":5,\"uniqueName\":\"\",\"label\":\"数量选择\",\"max\":10,\"min\":0,\"content\":0,\"isNecessary\":false,\"checkValue\":true},{\"type\":2,\"uniqueName\":\"\",\"label\":\"单选框\",\"select\":[\"选项1\",\"选项2\"],\"content\":\"选项2\",\"isNecessary\":true,\"checkValue\":true},{\"type\":3,\"uniqueName\":\"\",\"label\":\"多选框\",\"select\":[\"选项1\",\"选项12\",\"选项3\"],\"content\":[],\"isNecessary\":false,\"checkValue\":false}]');

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
  `check_number` int NOT NULL COMMENT '校验项的数量，不小于3',
  `state` int NOT NULL DEFAULT 0 COMMENT '0为关闭，1为开启',
  `filled` int NOT NULL DEFAULT 0 COMMENT '0为没开放过填写 可以编辑，1为开放过填写 不可以编辑',
  `permissions` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '填写权限，设置哪些人可以填写，存储account',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of form_list
-- ----------------------------
INSERT INTO `form_list` VALUES (12, '管理员', '2024-08-29 03:20:35', 'wh', 'test', '[{\"type\":7,\"uniqueName\":\"\",\"label\":\"人员ID\",\"suggestion\":\"\",\"content\":\"\",\"isNecessary\":true,\"checkValue\":true},{\"type\":2,\"uniqueName\":\"\",\"label\":\"单选框\",\"select\":[\"选项1\",\"选项2\",\"选项3\"],\"content\":[],\"isNecessary\":true,\"checkValue\":true},{\"type\":3,\"uniqueName\":\"\",\"label\":\"多选框\",\"select\":[\"选项1\",\"58\",\"选项3\",\"选项4\"],\"content\":[],\"isNecessary\":true,\"checkValue\":true},{\"type\":6,\"uniqueName\":\"\",\"label\":\"滑动条\",\"max\":1000,\"min\":0,\"content\":0,\"isNecessary\":false,\"checkValue\":true},{\"type\":7,\"uniqueName\":\"\",\"label\":\"带建议框\",\"suggestion\":\"\",\"content\":\"\",\"isNecessary\":false,\"checkValue\":false}]', 4, 1, 1, '123');
INSERT INTO `form_list` VALUES (13, '管理员', '2024-08-29 03:33:37', 'tbwh', 'test', '[{\"type\":7,\"uniqueName\":\"\",\"label\":\"人员ID\",\"suggestion\":\"\",\"content\":\"\",\"isNecessary\":true,\"checkValue\":true},{\"type\":20,\"uniqueName\":\"\",\"label\":\"自增表格\",\"header\":[\"列1\",\"列2\",\"列3\"],\"bodyForm\":[{\"type\":0,\"uniqueName\":\"\",\"label\":\"单行文本\",\"max\":100,\"min\":0,\"suggestion\":\"\",\"content\":\"\"},{\"type\":4,\"uniqueName\":\"\",\"label\":\"日期选择\",\"max\":100,\"min\":0,\"suggestion\":\"\",\"content\":\"\"},{\"type\":5,\"uniqueName\":\"\",\"label\":\"数量选择\",\"max\":100,\"min\":0,\"suggestion\":\"\",\"content\":\"\"}],\"content\":[[\"\",\"\",\"\"]]},{\"type\":5,\"uniqueName\":\"\",\"label\":\"数量选择\",\"max\":10,\"min\":0,\"content\":0,\"isNecessary\":false,\"checkValue\":true},{\"type\":2,\"uniqueName\":\"\",\"label\":\"单选框\",\"select\":[\"选项1\",\"选项2\"],\"content\":\"\",\"isNecessary\":true,\"checkValue\":true},{\"type\":3,\"uniqueName\":\"\",\"label\":\"多选框\",\"select\":[\"选项1\",\"选项12\",\"选项3\"],\"content\":[],\"isNecessary\":false,\"checkValue\":false}]', 3, 1, 1, '123');

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
) ENGINE = InnoDB AUTO_INCREMENT = 93 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of logs
-- ----------------------------
INSERT INTO `logs` VALUES (1, 'wh', '123', '登录', '2024-08-23 16:56:07');
INSERT INTO `logs` VALUES (2, '管理员', 'admin', '登录', '2024-08-25 00:00:00');
INSERT INTO `logs` VALUES (3, 'wh', '123', '登录', '2024-08-25 00:00:00');
INSERT INTO `logs` VALUES (4, '管理员', 'admin', '登录', '2024-08-25 00:00:00');
INSERT INTO `logs` VALUES (5, '管理员', 'admin', '登录', '2024-08-25 00:00:00');
INSERT INTO `logs` VALUES (6, '管理员', 'admin', '登录', '2024-08-25 15:49:10');
INSERT INTO `logs` VALUES (7, '管理员', 'admin', '登录', '2024-08-25 09:00:00');
INSERT INTO `logs` VALUES (8, '管理员', 'admin', '登录', '2024-08-25 00:00:00');
INSERT INTO `logs` VALUES (9, '管理员', 'admin', '登录', '2024-08-25 12:00:00');
INSERT INTO `logs` VALUES (10, '管理员', 'admin', '登录', '2024-08-25 00:00:00');
INSERT INTO `logs` VALUES (11, '管理员', 'admin', '登录', '2024-08-25 09:00:00');
INSERT INTO `logs` VALUES (12, 'wh', '123', '登录', '2024-08-25 08:00:00');
INSERT INTO `logs` VALUES (13, '管理员', 'admin', '登录', '2024-08-25 00:00:00');
INSERT INTO `logs` VALUES (14, '管理员', 'admin', '登录', '2024-08-25 00:00:00');
INSERT INTO `logs` VALUES (15, '管理员', 'admin', '登录', '2024-08-25 10:00:00');
INSERT INTO `logs` VALUES (16, '管理员', 'admin', '登录', '2024-08-25 16:31:39');
INSERT INTO `logs` VALUES (17, '管理员', 'admin', '登录', '2024-08-25 16:41:45');
INSERT INTO `logs` VALUES (18, '管理员', 'admin', '登录', '2024-08-25 18:13:53');
INSERT INTO `logs` VALUES (19, '管理员', 'admin', '登录', '2024-08-25 18:16:24');
INSERT INTO `logs` VALUES (20, 'wh', '123', '登录', '2024-08-25 18:23:01');
INSERT INTO `logs` VALUES (21, '管理员', 'admin', '登录', '2024-08-26 15:19:21');
INSERT INTO `logs` VALUES (22, '管理员', 'admin', '登录', '2024-08-26 16:04:27');
INSERT INTO `logs` VALUES (23, '管理员', 'admin', '登录', '2024-08-26 16:09:09');
INSERT INTO `logs` VALUES (24, '管理员', 'admin', '登录', '2024-08-26 16:10:18');
INSERT INTO `logs` VALUES (25, '管理员', 'admin', '登录', '2024-08-26 16:34:34');
INSERT INTO `logs` VALUES (26, '管理员', 'admin', '登录', '2024-08-26 17:05:50');
INSERT INTO `logs` VALUES (27, '管理员', 'admin', '登录', '2024-08-27 10:34:24');
INSERT INTO `logs` VALUES (28, '管理员', 'admin', '登录', '2024-08-27 11:30:55');
INSERT INTO `logs` VALUES (29, 'wh', '123', '登录', '2024-08-27 11:50:11');
INSERT INTO `logs` VALUES (30, 'wh', '123', '登录', '2024-08-27 11:52:57');
INSERT INTO `logs` VALUES (31, '管理员', 'admin', '登录', '2024-08-27 14:16:54');
INSERT INTO `logs` VALUES (32, '管理员', 'admin', '登录', '2024-08-27 14:18:09');
INSERT INTO `logs` VALUES (33, '管理员', 'admin', '登录', '2024-08-28 08:51:20');
INSERT INTO `logs` VALUES (34, 'wh', '123', '登录', '2024-08-28 09:01:34');
INSERT INTO `logs` VALUES (35, '管理员', 'admin', '登录', '2024-08-28 09:07:20');
INSERT INTO `logs` VALUES (36, 'wh', '123', '登录', '2024-08-28 09:15:17');
INSERT INTO `logs` VALUES (37, '管理员', 'admin', '登录', '2024-08-28 09:21:19');
INSERT INTO `logs` VALUES (38, 'wh', '123', '登录', '2024-08-28 09:29:56');
INSERT INTO `logs` VALUES (39, '管理员', 'admin', '登录', '2024-08-28 09:30:31');
INSERT INTO `logs` VALUES (40, '管理员', 'admin', '登录', '2024-08-28 11:39:15');
INSERT INTO `logs` VALUES (41, '管理员', 'admin', '登录', '2024-08-28 11:51:10');
INSERT INTO `logs` VALUES (42, 'wh', '123', '登录', '2024-08-28 15:17:46');
INSERT INTO `logs` VALUES (43, '管理员', 'admin', '登录', '2024-08-28 15:37:34');
INSERT INTO `logs` VALUES (44, 'wh', '123', '登录', '2024-08-28 16:06:08');
INSERT INTO `logs` VALUES (45, '管理员', 'admin', '登录', '2024-08-28 16:06:19');
INSERT INTO `logs` VALUES (46, '管理员', 'admin', '登录', '2024-08-28 16:09:20');
INSERT INTO `logs` VALUES (47, '管理员', 'admin', '登录', '2024-08-28 16:15:25');
INSERT INTO `logs` VALUES (48, '管理员', 'admin', '登录', '2024-08-28 16:18:31');
INSERT INTO `logs` VALUES (49, '管理员', 'admin', '登录', '2024-08-28 16:19:18');
INSERT INTO `logs` VALUES (50, '管理员', 'admin', '登录', '2024-08-28 16:19:58');
INSERT INTO `logs` VALUES (51, '管理员', 'admin', '登录', '2024-08-28 17:13:24');
INSERT INTO `logs` VALUES (52, '管理员', 'admin', '登录', '2024-08-28 17:37:51');
INSERT INTO `logs` VALUES (53, '管理员', 'admin', '登录', '2024-08-29 01:54:46');
INSERT INTO `logs` VALUES (54, '管理员', 'admin', '登录', '2024-08-29 01:59:25');
INSERT INTO `logs` VALUES (55, 'wh', '123', '登录', '2024-08-29 02:05:50');
INSERT INTO `logs` VALUES (56, 'wh', '123', '登录', '2024-08-29 02:11:06');
INSERT INTO `logs` VALUES (57, '管理员', 'admin', '登录', '2024-08-29 02:11:13');
INSERT INTO `logs` VALUES (58, 'wh', '123', '登录', '2024-08-29 02:11:34');
INSERT INTO `logs` VALUES (59, '管理员', 'admin', '登录', '2024-08-29 02:26:12');
INSERT INTO `logs` VALUES (60, '管理员', 'admin', '登录', '2024-08-29 02:27:00');
INSERT INTO `logs` VALUES (61, '管理员', 'admin', '登录', '2024-08-29 02:28:38');
INSERT INTO `logs` VALUES (62, '管理员', 'admin', '登录', '2024-08-29 02:29:00');
INSERT INTO `logs` VALUES (63, '管理员', 'admin', '登录', '2024-08-29 02:29:12');
INSERT INTO `logs` VALUES (64, '管理员', 'admin', '登录', '2024-08-29 02:29:23');
INSERT INTO `logs` VALUES (65, '管理员', 'admin', '登录', '2024-08-29 02:30:24');
INSERT INTO `logs` VALUES (66, '管理员', 'admin', '登录', '2024-08-29 02:31:25');
INSERT INTO `logs` VALUES (67, '管理员', 'admin', '登录', '2024-08-29 02:33:29');
INSERT INTO `logs` VALUES (68, 'wh', '123', '登录', '2024-08-29 02:35:07');
INSERT INTO `logs` VALUES (69, '管理员', 'admin', '登录', '2024-08-29 02:37:48');
INSERT INTO `logs` VALUES (70, 'wh', '123', '登录', '2024-08-29 02:38:06');
INSERT INTO `logs` VALUES (71, '管理员', 'admin', '登录', '2024-08-29 03:08:59');
INSERT INTO `logs` VALUES (72, '管理员', 'admin', '登录', '2024-08-29 03:12:37');
INSERT INTO `logs` VALUES (73, 'wh', '123', '登录', '2024-08-29 03:16:29');
INSERT INTO `logs` VALUES (74, '管理员', 'admin', '登录', '2024-08-29 03:16:37');
INSERT INTO `logs` VALUES (75, '管理员', 'admin', '登录', '2024-08-29 03:16:47');
INSERT INTO `logs` VALUES (76, 'wh', '123', '登录', '2024-08-29 03:17:09');
INSERT INTO `logs` VALUES (77, '管理员', 'admin', '登录', '2024-08-29 03:20:32');
INSERT INTO `logs` VALUES (78, 'wh', '123', '登录', '2024-08-29 03:20:44');
INSERT INTO `logs` VALUES (79, '管理员', 'admin', '登录', '2024-08-29 03:32:32');
INSERT INTO `logs` VALUES (80, 'wh', '123', '登录', '2024-08-29 03:33:46');
INSERT INTO `logs` VALUES (81, '管理员', 'admin', '登录', '2024-08-29 03:45:34');
INSERT INTO `logs` VALUES (82, 'wh', '123', '登录', '2024-08-29 03:56:51');
INSERT INTO `logs` VALUES (83, 'wh', '123', '登录', '2024-08-29 04:05:36');
INSERT INTO `logs` VALUES (84, '管理员', 'admin', '登录', '2024-08-29 23:26:43');
INSERT INTO `logs` VALUES (85, 'wh', '123', '登录', '2024-08-29 23:27:22');
INSERT INTO `logs` VALUES (86, 'wh', '123', '登录', '2024-08-30 01:47:04');
INSERT INTO `logs` VALUES (87, 'wh', '123', '登录', '2024-08-30 02:07:42');
INSERT INTO `logs` VALUES (88, '管理员', 'admin', '登录', '2024-08-30 02:46:28');
INSERT INTO `logs` VALUES (89, '管理员', 'admin', '登录', '2024-08-30 02:53:18');
INSERT INTO `logs` VALUES (90, '管理员', 'admin', '登录', '2024-08-30 02:54:22');
INSERT INTO `logs` VALUES (91, '管理员', 'admin', '登录', '2024-08-30 03:29:51');
INSERT INTO `logs` VALUES (92, '管理员', 'admin', '登录', '2024-08-30 03:36:21');

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
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of notice
-- ----------------------------

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
INSERT INTO `user` VALUES ('123', '123', 'wh', '14705253625', 0, '[\'自定义表单\',\'表单列表\',\'表单填写\']', '2024-08-25 04:13:03');
INSERT INTO `user` VALUES ('admin', 'admin', '管理员', '14536253625', 1, 'admin', '2024-08-24 02:13:07');

SET FOREIGN_KEY_CHECKS = 1;
