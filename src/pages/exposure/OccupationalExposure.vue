<template>
  <div class="app-container">
    <el-tabs @tab-click="change">
      <el-tab-pane v-for="(item, index) in tabs" :key="index" :label="item.tabName">
        <el-form class="search" size="small">
          <div class="search-left">
            <el-date-picker
              v-model="searchModel.startTime"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择起始日期"
            />
            -
            <el-date-picker
              v-model="searchModel.endTime"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择截止日期"
            />
            <el-button
              icon="el-icon-search"
              type="primary"
              style="margin: 0 20px"
              @click="getData"
              >查询</el-button
            >
          </div>
          <div class="search-right">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              @click="openPlanTemplate(item.tabPlanTemplateName)"
              v-if="$store.state.user.userInfo.Power == 3"
              >追踪计划模板</el-button
            >
          </div>
        </el-form>
        <div style="background: #ceeaf3; height: 40px; line-height: 40px">
          <el-row>
            <el-col :span="23" />
            <el-col :span="1">
              <el-tooltip class="item" effect="dark" content="导出" placement="top">
                <i class="el-icon-folder-opened out-icon" @click="handleDownload" />
              </el-tooltip>
            </el-col>
          </el-row>
        </div>
        <el-table
          v-if="index === 0"
          v-loading="listLoading"
          :header-cell-style="{
            'background-color': '#fefefe',
            color: '#959595',
          }"
          border
          :data="
            item.tableData.slice(
              (listQuery.page - 1) * listQuery.limit,
              listQuery.page * listQuery.limit
            )
          "
          fit
          highlight-current-row
          style="width: 100%"
          @sort-change="sortChange"
        >
          <el-table-column
            width="100px"
            fixed="left"
            align="center"
            prop="Name"
            label="姓名"
          />
          <el-table-column
            width="60px"
            fixed="left"
            align="center"
            prop="Sex"
            label="性别"
          />
          <el-table-column
            width="60px"
            fixed="left"
            align="center"
            prop="Seniority"
            label="工龄"
          />
          <el-table-column
            width="150px"
            fixed="left"
            align="center"
            prop="Dept"
            label="科室"
          />
          <el-table-column
            width="110px"
            fixed="left"
            align="center"
            prop="Phone"
            label="联系电话"
          />
          <el-table-column width="100px" fixed="left" align="center" label="受伤日期">
            <template slot-scope="scope">
              {{ scope.row.InjuryDate.split("T")[0] }}
            </template>
          </el-table-column>
          <el-table-column width="80px" fixed="left" align="center" label="追踪计划">
            <template slot-scope="scope">
              <i class="el-icon-document form-icon" @click="checkPlan(scope.row)"></i>
            </template>
          </el-table-column>
          <el-table-column
            width="220px"
            align="center"
            prop="InoculationYG"
            label="被刺伤前是否接种过乙肝疫苗"
          />
          <el-table-column
            width="150px"
            prop="InoculationYGDate"
            align="center"
            label="注射日期"
          />
          <el-table-column width="150px" align="center" prop="JobType" label="工作类别" />
          <el-table-column
            width="150px"
            align="center"
            prop="OtherJobType"
            label="其他工作类别"
          />
          <el-table-column
            width="150px"
            align="center"
            prop="PlaceInjury"
            label="伤害发生地点"
          />
          <el-table-column
            width="150px"
            align="center"
            prop="OtherPlaceInjury"
            label="其他伤害发生地点"
          />
          <el-table-column
            width="180px"
            align="center"
            prop="SharpsType"
            label="导致伤害的锐物器种类"
          />
          <el-table-column
            width="200px"
            align="center"
            prop="OtherSharpsType"
            label="其他导致伤害的锐物器种类"
          />
          <el-table-column
            width="180px"
            align="center"
            prop="InjuryCause"
            label="伤害发生是由谁造成的"
          />
          <el-table-column
            width="220px"
            align="center"
            prop="SharpsFirstUse"
            label="受伤者是否锐器的最初使用者"
          />
          <el-table-column
            width="200px"
            align="center"
            prop="SharpsUsePurpose"
            label="锐器最初是用作什么目的"
          />
          <el-table-column
            width="220px"
            align="center"
            prop="OtherSharpsUsePurpose"
            label="锐器最初是用作什么目的_其他"
          />
          <el-table-column
            width="200px"
            align="center"
            prop="OperationTraining"
            label="是否经过规范化操作培训"
          />
          <el-table-column
            width="200px"
            align="center"
            prop="WrongOperation"
            label="伤害的发生有无不正确操作"
          />
          <el-table-column
            width="200px"
            align="center"
            prop="SharpsStabWound"
            label="是否被血污染的锐器物刺伤"
          />
          <el-table-column
            width="300px"
            align="center"
            prop="SpreadDisease"
            label="受伤前是否知道病人有无经血液传播的疾病"
          />
          <el-table-column
            width="150px"
            align="center"
            prop="PatientSituation"
            label="病人的带病情况"
          />
          <el-table-column
            width="150px"
            align="center"
            prop="OtherPatientSituation"
            label="病人的其他带病情况"
          />
          <el-table-column
            width="150px"
            align="center"
            prop="FirstSymptom"
            label="操作前准备"
          />
          <el-table-column
            width="150px"
            align="center"
            prop="InOperation"
            label="操作中"
          />
          <el-table-column
            width="150px"
            align="center"
            prop="AfterOperation"
            label="操作后整理用物"
          />
          <el-table-column
            width="150px"
            align="center"
            prop="DealWith"
            label="处理废弃物"
          />
          <el-table-column
            width="150px"
            align="center"
            prop="WoundDealWith"
            label="受伤后伤口处理情况"
          />
          <el-table-column
            width="220px"
            align="center"
            prop="SharpsPenetrate"
            label="如果受伤部位是手，锐器穿透"
          />
          <el-table-column
            width="150px"
            align="center"
            prop="InjuredDegree"
            label="受伤程度"
          />
          <el-table-column
            width="120px"
            align="center"
            prop="SharpsUser"
            label="锐器使用者是"
          />
          <el-table-column
            width="150px"
            align="center"
            prop="PositionNumber"
            label="伤害发生的位置号码"
          />
          <el-table-column
            width="200px"
            align="center"
            prop="ProcessDealWith"
            label="伤害发生的过程及处理情况"
          />
          <el-table-column width="120px" align="center" label="填报时间"
            ><template slot-scope="scope">
              {{ scope.row.FillingTime.split("T")[0] }}
            </template>
          </el-table-column>
          <el-table-column width="120px" align="center" prop="Entry" label="填报项" />
          <el-table-column width="120px" align="center" prop="EntryUser" label="填报人" />
          <el-table-column
            width="120px"
            align="center"
            prop="VerifyOpinion"
            label="科室核实意见"
          />
          <el-table-column width="120px" align="center" prop="Director" label="主任" />
          <el-table-column width="120px" align="center" prop="HeadNurse" label="护士长" />
          <el-table-column width="120px" align="center" label="核实日期"
            ><template slot-scope="scope">
              {{ scope.row.Bottomdate.split("T")[0] }}
            </template>
          </el-table-column>
        </el-table>
        <el-table
          v-if="index === 1"
          v-loading="listLoading"
          :header-cell-style="{
            'background-color': '#fefefe',
            color: '#959595',
          }"
          border
          :data="
            item.tableData.slice(
              (listQuery.page - 1) * listQuery.limit,
              listQuery.page * listQuery.limit
            )
          "
          fit
          highlight-current-row
          style="width: 100%"
          @sort-change="sortChange"
        >
          <el-table-column
            width="100px"
            fixed="left"
            align="center"
            prop="Name"
            label="姓名"
          />
          <el-table-column
            width="60px"
            fixed="left"
            align="center"
            prop="Sex"
            label="性别"
          />
          <el-table-column
            width="60px"
            fixed="left"
            align="center"
            prop="Seniority"
            label="工龄"
          />
          <el-table-column
            width="150px"
            fixed="left"
            align="center"
            prop="Dept"
            label="科室"
          />
          <el-table-column
            width="110px"
            fixed="left"
            align="center"
            prop="Phone"
            label="联系电话"
          />
          <el-table-column width="100px" fixed="left" align="center" label="暴露日期">
            <template slot-scope="scope">
              {{ scope.row.ExposureDate.split("T")[0] }}
            </template>
          </el-table-column>
          <el-table-column width="80px" fixed="left" align="center" label="追踪计划">
            <template slot-scope="scope">
              <i class="el-icon-document form-icon" @click="checkPlan(scope.row)"></i>
            </template>
          </el-table-column>
          <el-table-column
            width="200px"
            align="center"
            prop="ExposureYG"
            label="暴露前是否接种过乙肝疫苗"
          />
          <el-table-column
            width="120px"
            align="center"
            prop="ExposureYGDate"
            label="注射时间"
          />
          <el-table-column width="120px" align="center" prop="JobType" label="工作类别" />
          <el-table-column
            width="120px"
            align="center"
            prop="OtherJobType"
            label="其他工作类别"
          />
          <el-table-column
            width="200px"
            align="center"
            prop="ExposureOccur"
            label="暴露发生地点"
          />
          <el-table-column
            width="150px"
            align="center"
            prop="OtherPlaceInjury"
            label="其他暴露发生地点"
          />
          <el-table-column
            width="150px"
            align="center"
            prop="ExposureCause"
            label="暴露是由谁造成的"
          />
          <el-table-column
            width="180px"
            align="center"
            prop="NormOperation"
            label="是否经过规范化操作培训"
          />
          <el-table-column
            width="240px"
            align="center"
            prop="CorrectWear"
            label="暴露发生时是否正确佩戴防护用品"
          />
          <el-table-column
            width="300px"
            align="center"
            prop="SpreadDisease"
            label="暴露前是否知道病人有无经血液传播的疾病"
          />
          <el-table-column
            width="120px"
            align="center"
            prop="PatientSituation"
            label="病人的带病情况"
          />
          <el-table-column
            width="150px"
            align="center"
            prop="OtherPatientSituation"
            label="病人的其他带病情况"
          />
          <el-table-column
            width="120px"
            align="center"
            prop="ExposurePosition"
            label="暴露发生的部位"
          />
          <el-table-column
            width="200px"
            align="center"
            prop="ProcessDealWith"
            label="暴露发生的过程及处理情况"
          />
          <el-table-column width="120px" align="center" label="填报时间"
            ><template slot-scope="scope">
              {{ scope.row.FillingTime.split("T")[0] }}
            </template>
          </el-table-column>
          <el-table-column width="120px" align="center" prop="Entry" label="填报项" />
          <el-table-column width="120px" align="center" prop="EntryUser" label="填报人" />
          <el-table-column
            width="120px"
            align="center"
            prop="VerifyOpinion"
            label="科室核实意见"
          />
          <el-table-column width="120px" align="center" prop="Director" label="主任" />
          <el-table-column width="120px" align="center" prop="HeadNurse" label="护士长" />
          <el-table-column width="120px" align="center" label="核实日期"
            ><template slot-scope="scope">
              {{ scope.row.Bottomdate.split("T")[0] }}
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="listQuery.page"
          :page-size="listQuery.limit"
          layout="prev, pager, next, jumper"
          :total="item.tableData.length"
          @current-change="handleCurrentChange"
        />
      </el-tab-pane>
    </el-tabs>

    <el-dialog :title="nowPlan.title" :visible.sync="tPlan">
      <el-table :data="nowPlan.data">
        <el-table-column prop="name" label="追踪内容" />
        <el-table-column prop="planDate" label="计划时间" />
        <el-table-column prop="completeDate" label="完成时间" />
        <el-table-column prop="state" label="状态">
          <template slot-scope="scope">
            {{ scope.row.state ? "已完成" : "未完成" }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog :title="planTitle" :visible.sync="planShow">
      <el-tooltip class="item" effect="dark" content="添加追踪计划模板" placement="top">
        <el-button
          type="primary"
          icon="el-icon-plus"
          plain
          class="add-plan-btn"
          size="small"
          @click="openAddPlanTemplate"
        />
      </el-tooltip>
      <el-table :data="planTemplateTable">
        <el-table-column label="创建日期" width="150">
          <template slot-scope="scope">
            {{ scope.row.InDate.split("T")[0] }}
          </template>
        </el-table-column>
        <el-table-column property="InUser" label="创建人" width="200" />
        <el-table-column label="状态" width="150">
          <template slot-scope="scope">
            <el-button type="text" @click="editState(scope.row)">
              {{ scope.row.State === "Y" ? "可用" : "不可用" }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="模板详情(点击查看)">
          <template slot-scope="scope">
            <el-popover placement="right" width="240" trigger="click">
              <el-table :data="scope.row.TContent.plans" border>
                <el-table-column min-width="100" property="name" label="追踪计划" />
                <el-table-column min-width="100" property="days" label="天数" />
              </el-table>
              <el-link slot="reference" type="primary">{{
                scope.row.TContent.type
              }}</el-link>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="editPlan(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-delete"
              @click="delPlan(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-drawer :title="editOrAdd" :visible.sync="addPlanShow">
      <el-form ref="form" :model="planForm" label-width="90px" class="add-form">
        <el-form-item label="暴露种类：">
          <el-input
            v-model="planForm.type"
            placeholder="请输入暴露种类"
            style="width: 70%"
          />
        </el-form-item>
        <el-form-item label="追踪计划：">
          <el-row
            v-for="(item, index) in planForm.plans"
            :key="item"
            class="add-form-row"
          >
            <el-col :span="8">
              <el-input v-model="item.name" placeholder="请输入计划" size="small" />
            </el-col>
            <el-col class="line" :span="1" style="text-align: center">-</el-col>
            <el-col :span="5">
              <el-input-number
                v-model="item.days"
                :min="1"
                :max="100"
                label="天数"
                style="width: 94%"
                size="small"
              />
            </el-col>
            <!-- <el-col :span="2">天</el-col> -->
            <el-col :span="3">
              <el-select v-model="item.unit">
                <el-option value="天">天</el-option>
                <el-option value="次">次</el-option>
              </el-select>
            </el-col>
            <el-col :span="6" class="row-btns">
              <el-button
                v-if="index === planForm.plans.length - 1"
                class="btn-add"
                type="primary"
                circle
                plain
                icon="el-icon-plus"
                size="mini"
                @click="addPlan"
              />
              <el-button
                v-if="planForm.plans.length !== 1"
                class="btn-reduce"
                type="danger"
                circle
                plain
                icon="el-icon-minus"
                size="mini"
                @click="reducePlan(index)"
              />
            </el-col>
          </el-row>
        </el-form-item>
        <div class="menu-btn" style="padding: 0 40px">
          <el-button type="primary" @click="sureAdd">提交</el-button>
          <el-button @click="addPlanShow = false">取消</el-button>
        </div>
      </el-form>
    </el-drawer>
    <el-table
      hidden
      v-if="parseInt(tabIndex) === 0"
      v-loading="listLoading"
      class="tableData0"
      :header-cell-style="{
        'background-color': '#fefefe',
        color: '#959595',
      }"
      border
      :data="tabs[0].tableData2"
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column prop="Name" label="姓名" />
      <el-table-column prop="Sex" label="性别" />
      <el-table-column prop="Seniority" label="工龄" />
      <el-table-column prop="Dept" label="科室" />
      <el-table-column prop="Phone" label="联系电话" />
      <el-table-column label="受伤日期">
        <template slot-scope="scope">
          {{ scope.row.InjuryDate.split("T")[0] }}
        </template>
      </el-table-column>
      <el-table-column label="追踪计划">
        <template slot-scope="scope">
          <i class="el-icon-document form-icon" @click="checkPlan(scope.row)"></i>
        </template>
      </el-table-column>
      <el-table-column prop="InoculationYG" label="被刺伤前是否接种过乙肝疫苗" />
      <el-table-column prop="InoculationYGDate" label="注射日期" />
      <el-table-column prop="JobType" label="工作类别" />
      <el-table-column prop="OtherJobType" label="其他工作类别" />
      <el-table-column prop="PlaceInjury" label="伤害发生地点" />
      <el-table-column prop="OtherPlaceInjury" label="其他伤害发生地点" />
      <el-table-column
        width="120px"
        align="center"
        prop="SharpsType"
        label="导致伤害的锐物器种类"
      />
      <el-table-column prop="OtherSharpsType" label="其他导致伤害的锐物器种类" />
      <el-table-column prop="InjuryCause" label="伤害发生是由谁造成的" />
      <el-table-column prop="SharpsFirstUse" label="受伤者是否锐器的最初使用者" />
      <el-table-column prop="SharpsUsePurpose" label="锐器最初是用作什么目的" />
      <el-table-column prop="OtherSharpsUsePurpose" label="锐器最初是用作什么目的_其他" />
      <el-table-column prop="OperationTraining" label="是否经过规范化操作培训" />
      <el-table-column prop="WrongOperation" label="伤害的发生有无不正确操作" />
      <el-table-column prop="SharpsStabWound" label="是否被血污染的锐器物刺伤" />
      <el-table-column
        prop="SpreadDisease"
        label="受伤前是否知道病人有无经血液传播的疾病"
      />
      <el-table-column prop="PatientSituation" label="病人的带病情况" />
      <el-table-column prop="OtherPatientSituation" label="病人的其他带病情况" />
      <el-table-column prop="FirstSymptom" label="操作前准备" />
      <el-table-column prop="InOperation" label="操作中" />
      <el-table-column prop="AfterOperation" label="操作后整理用物" />
      <el-table-column prop="DealWith" label="处理废弃物" />
      <el-table-column prop="WoundDealWith" label="受伤后伤口处理情况" />
      <el-table-column prop="SharpsPenetrate" label="如果受伤部位是手，锐器穿透" />
      <el-table-column prop="InjuredDegree" label="受伤程度" />
      <el-table-column prop="SharpsUser" label="锐器使用者是" />
      <el-table-column prop="PositionNumber" label="伤害发生的位置号码" />
      <el-table-column prop="ProcessDealWith" label="伤害发生的过程及处理情况" />
      <el-table-column label="填报时间"
        ><template slot-scope="scope">
          {{ scope.row.FillingTime.split("T")[0] }}
        </template>
      </el-table-column>
      <el-table-column prop="Entry" label="填报项" />
      <el-table-column prop="EntryUser" label="填报人" />
      <el-table-column prop="VerifyOpinion" label="科室核实意见" />
      <el-table-column prop="Director" label="主任" />
      <el-table-column prop="HeadNurse" label="护士长" />
      <el-table-column label="核实日期"
        ><template slot-scope="scope">
          {{ scope.row.Bottomdate.split("T")[0] }}
        </template>
      </el-table-column>
      <el-table-column label="暴露种类"
        ><template slot-scope="scope">
          {{ scope.row.cType }}
        </template>
      </el-table-column>
      <el-table-column label="追踪内容"
        ><template slot-scope="scope">
          <p>{{ scope.row.cName }}</p>
        </template>
      </el-table-column>
      <el-table-column label="计划时间"
        ><template slot-scope="scope">
          <p>{{ scope.row.cPlanDate }}</p>
        </template>
      </el-table-column>
      <el-table-column label="完成时间"
        ><template slot-scope="scope">
          <p>{{ scope.row.cDate }}</p>
        </template>
      </el-table-column>
      <el-table-column label="状态"
        ><template slot-scope="scope">
          <p v-if="scope.row.cState">已完成</p>
          <p v-else>未完成</p>
        </template>
      </el-table-column>
    </el-table>
    <el-table
      hidden
      v-if="parseInt(tabIndex) === 1"
      v-loading="listLoading"
      class="tableData1"
      :header-cell-style="{
        'background-color': '#fefefe',
        color: '#959595',
      }"
      border
      :data="tabs[1].tableData2"
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column prop="Name" label="姓名" />
      <el-table-column prop="Sex" label="性别" />
      <el-table-column prop="Seniority" label="工龄" />
      <el-table-column prop="Dept" label="科室" />
      <el-table-column prop="Phone" label="联系电话" />
      <el-table-column label="暴露日期">
        <template slot-scope="scope">
          {{ scope.row.ExposureDate.split("T")[0] }}
        </template>
      </el-table-column>
      <el-table-column label="追踪计划">
        <template slot-scope="scope">
          <i class="el-icon-document form-icon" @click="checkPlan(scope.row)"></i>
        </template>
      </el-table-column>
      <el-table-column prop="ExposureYG" label="暴露前是否接种过乙肝疫苗" />
      <el-table-column prop="ExposureYGDate" label="注射时间" />
      <el-table-column prop="JobType" label="工作类别" />
      <el-table-column prop="OtherJobType" label="其他工作类别" />
      <el-table-column prop="ExposureOccur" label="暴露发生地点" />
      <el-table-column prop="OtherPlaceInjury" label="其他暴露发生地点" />
      <el-table-column prop="ExposureCause" label="暴露是由谁造成的" />
      <el-table-column prop="NormOperation" label="是否经过规范化操作培训" />
      <el-table-column prop="CorrectWear" label="暴露发生时是否正确佩戴防护用品" />
      <el-table-column
        prop="SpreadDisease"
        label="暴露前是否知道病人有无经血液传播的疾病"
      />
      <el-table-column prop="PatientSituation" label="病人的带病情况" />
      <el-table-column prop="OtherPatientSituation" label="病人的其他带病情况" />
      <el-table-column prop="ExposurePosition" label="暴露发生的部位" />
      <el-table-column prop="ProcessDealWith" label="暴露发生的过程及处理情况" />
      <el-table-column label="填报时间"
        ><template slot-scope="scope">
          {{ scope.row.FillingTime.split("T")[0] }}
        </template>
      </el-table-column>
      <el-table-column prop="Entry" label="填报项" />
      <el-table-column prop="EntryUser" label="填报人" />
      <el-table-column prop="VerifyOpinion" label="科室核实意见" />
      <el-table-column prop="Director" label="主任" />
      <el-table-column prop="HeadNurse" label="护士长" />
      <el-table-column label="核实日期"
        ><template slot-scope="scope">
          {{ scope.row.Bottomdate.split("T")[0] }}
        </template>
      </el-table-column>
      <el-table-column label="暴露种类"
        ><template slot-scope="scope">
          {{ scope.row.TreatmentPlan.cType }}
        </template>
      </el-table-column>
      <el-table-column label="追踪内容"
        ><template slot-scope="scope">
          <p>{{ scope.row.cName }}</p>
        </template>
      </el-table-column>
      <el-table-column label="计划时间"
        ><template slot-scope="scope">
          <p>{{ scope.row.cPlanDate }}</p>
        </template>
      </el-table-column>
      <el-table-column label="完成时间"
        ><template slot-scope="scope">
          <p>{{ scope.row.cDate }}</p>
        </template>
      </el-table-column>
      <el-table-column label="状态"
        ><template slot-scope="scope">
          <p v-if="scope.row.cState">已完成</p>
          <p v-else>未完成/</p>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {
  getTemplateContentData,
  addTemplateContentData,
  getSharpsInjuryData,
  getBloodFluidExposeData,
  editTemplateContentState,
  editTemplateContentData,
  delTemplateContentData,
} from "@/api/exposure";

import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination";
import FileSaver from "file-saver";
import XLSX from "xlsx";

export default {
  name: "HealthEducation",
  components: {
    Pagination,
  },
  data() {
    return {
      planShow: false,
      planTitle: "",
      planTemplateTable: [],
      addPlanShow: false,
      planForm: {
        type: "",
        plans: [
          {
            name: "",
            days: 1,
            unit: "天",
          },
        ],
      },
      tabs: [
        {
          tabName: "锐器伤",
          tabPlanTemplateName: "锐器伤登记追踪计划模板",
          tableData: [],
          tableData2: [],
        },
        {
          tabName: "血液体液暴露",
          tabPlanTemplateName: "血液体液暴露登记追踪计划模板",
          tableData: [],
          tableData2: [],
        },
      ],
      searchModel: {
        startTime: "",
        endTime: "",
        hospitalCode: this.$store.state.user.userInfo.hospitalCode,
      },
      listLoading: true,
      total: 60,
      listQuery: {
        page: 1,
        limit: 10,
        sort: "+id",
      },
      tPlan: false,
      nowPlan: {
        title: "",
        data: [],
      },
      tabIndex: 0,
      editOrAdd: "",
      planStatus: 0, //0 添加  1 编辑
      selectID: 0,
    };
  },
  created() {
    this.getData();
  },
  methods: {
    editPlan(row) {
      this.planStatus = 1;
      this.editOrAdd = "编辑追踪计划模板";
      this.addPlanShow = true;
      this.selectID = row.ID;
      this.planForm.plans = row.TContent.plans;
      this.planForm.type = row.TContent.type;
    },
    delPlan(row) {
      this.$confirm("删除后不可恢复，是否确定")
        .then((_) => {
          delTemplateContentData({ id: row.ID }).then((res) => {
            if (res.d === 1) {
              this.$message({
                showClose: true,
                message: "删除成功",
                type: "success",
              });
              this.getTemplateData();
            }
          });
        })
        .catch((_) => {});
    },
    handleCurrentChange(page) {
      this.listQuery.page = page;
    },
    editState(row) {
      let state;
      if (row.State === "Y") {
        state = "N";
      } else {
        state = "Y";
      }
      const data = {
        id: row.ID,
        state: state,
      };
      editTemplateContentState(data).then((res) => {
        if (res.d === 1) {
          this.$message({
            showClose: true,
            message: "状态修改成功",
            type: "success",
          });
          this.getTemplateData();
        }
      });
    },
    checkPlan(row) {
      if (row.TreatmentPlan === "") {
        this.$message({
          showClose: true,
          message: "暂无追踪计划,请及时添加",
          type: "info",
        });
      } else {
        this.nowPlan.title = row.TreatmentPlan.type;
        this.nowPlan.data = row.TreatmentPlan.planData;
        this.tPlan = true;
      }
    },
    openPlanTemplate(name) {
      this.planTitle = name;
      this.getTemplateData();
      this.planShow = true;
    },
    openAddPlanTemplate() {
      this.planStatus = 0;
      this.editOrAdd = "添加追踪计划模板";
      this.addPlanShow = true;
      this.planForm = {
        type: "",
        plans: [
          {
            name: "",
            days: 1,
            unit: "天",
          },
        ],
      };
    },
    addPlan() {
      this.planForm.plans.push({ name: "", days: 1, unit: "天" });
    },
    reducePlan(idx) {
      this.planForm.plans.splice(idx, 1);
    },
    sureAdd() {
      if (this.planStatus === 1) {
        editTemplateContentData({
          id: this.selectID,
          content: JSON.stringify(this.planForm),
        }).then((res) => {
          if (res.d === 1) {
            this.$message({
              showClose: true,
              message: "修改成功",
              type: "success",
            });
            this.addPlanShow = false;
            this.getTemplateData();
          }
        });
      } else {
        if (this.planForm.type === "") {
          this.$message("请输入暴露种类");
          return;
        } else if (this.planForm.plans[0].name === "") {
          this.$message("至少输入一个计划内容");
          return;
        } else {
          const data = {
            hospitalCode: this.$store.state.user.userInfo.hospitalCode,
            tName: this.planTitle,
            tContent: JSON.stringify(this.planForm),
            inUser: this.$store.state.user.userInfo.Name,
          };
          addTemplateContentData(data).then((res) => {
            if (res.d === 1) {
              this.$message({
                showClose: true,
                message: "添加成功",
                type: "success",
              });
              this.getTemplateData();
              this.addPlanShow = false;
            }
          });
        }
      }
    },
    getTemplateData() {
      const data = {
        hospitalCode: this.$store.state.user.userInfo.hospitalCode,
        tName: this.planTitle,
        state: "",
      };
      getTemplateContentData(data).then((res) => {
        const resData = JSON.parse(res.d);
        resData.forEach((item) => {
          item.TContent = JSON.parse(item.TContent);
        });
        this.planTemplateTable = resData;
      });
    },
    getData() {
      this.tabs[0].tableData = [];
      this.tabs[1].tableData = [];
      const data = {
        hospitalCode: this.$store.state.user.userInfo.hospitalCode,
        startDate: this.searchModel.startTime,
        endDate: this.searchModel.endTime,
      };
      getSharpsInjuryData(data).then((res) => {
        switch (this.$store.state.user.userInfo.Power) {
          case 3:
            this.tabs[0].tableData = JSON.parse(res.d);
            break;
          default:
            JSON.parse(res.d).forEach((v) => {
              if (v.Dept === this.$store.state.user.userInfo.Department) {
                this.tabs[0].tableData.push(v);
              }
            });
            break;
        }
        for (let i = 0; i < this.tabs[0].tableData.length; i++) {
          if (this.tabs[0].tableData[i].TreatmentPlan != "") {
            this.tabs[0].tableData[i].TreatmentPlan = JSON.parse(
              this.tabs[0].tableData[i].TreatmentPlan
            );
          }
        }
        const table = [];
        for (let i = 0; i < this.tabs[0].tableData.length; i++) {
          if (this.tabs[0].tableData[i].TreatmentPlan !== "") {
            for (
              let j = 0;
              j < this.tabs[0].tableData[i].TreatmentPlan.planData.length;
              j++
            ) {
              this.tabs[0].tableData[i].cType = this.tabs[0].tableData[
                i
              ].TreatmentPlan.type;
              this.tabs[0].tableData[i].cDate = this.tabs[0].tableData[
                i
              ].TreatmentPlan.planData[j].completeDate;
              this.tabs[0].tableData[i].cName = this.tabs[0].tableData[
                i
              ].TreatmentPlan.planData[j].name;
              this.tabs[0].tableData[i].cPlanDate = this.tabs[0].tableData[
                i
              ].TreatmentPlan.planData[j].planDate;
              this.tabs[0].tableData[i].cState = this.tabs[0].tableData[
                i
              ].TreatmentPlan.planData[j].state;
              table[table.length] = this.tabs[0].tableData[i];
            }
          } else {
            this.tabs[0].tableData[i].cType = "";
            this.tabs[0].tableData[i].cDate = "";
            this.tabs[0].tableData[i].cName = "";
            this.tabs[0].tableData[i].cPlanDate = "";
            this.tabs[0].tableData[i].cState = "";
            table[table.length] = this.tabs[0].tableData[i];
          }
        }
        this.tabs[0].tableData2 = table;
      });
      getBloodFluidExposeData(data).then((res) => {
        switch (this.$store.state.user.userInfo.Power) {
          case 3:
            this.tabs[1].tableData = JSON.parse(res.d);
            break;
          default:
            JSON.parse(res.d).forEach((v) => {
              if (v.Dept === this.$store.state.user.userInfo.Department) {
                this.tabs[1].tableData.push(v);
              }
            });
            break;
        }
        for (let i = 0; i < this.tabs[1].tableData.length; i++) {
          if (this.tabs[1].tableData[i].TreatmentPlan != "") {
            this.tabs[1].tableData[i].TreatmentPlan = JSON.parse(
              this.tabs[1].tableData[i].TreatmentPlan
            );
          }
        }
        const table2 = [];
        for (let i = 0; i < this.tabs[1].tableData.length; i++) {
          if (this.tabs[1].tableData[i].TreatmentPlan !== "") {
            for (
              let j = 0;
              j < this.tabs[1].tableData[i].TreatmentPlan.planData.length;
              j++
            ) {
              this.tabs[1].tableData[i].cType = this.tabs[1].tableData[
                i
              ].TreatmentPlan.type;
              this.tabs[1].tableData[i].cDate = this.tabs[1].tableData[
                i
              ].TreatmentPlan.planData[j].completeDate;
              this.tabs[1].tableData[i].cName = this.tabs[1].tableData[
                i
              ].TreatmentPlan.planData[j].name;
              this.tabs[1].tableData[i].cPlanDate = this.tabs[1].tableData[
                i
              ].TreatmentPlan.planData[j].planDate;
              this.tabs[1].tableData[i].cState = this.tabs[1].tableData[
                i
              ].TreatmentPlan.planData[j].state;
              table2[table2.length] = this.tabs[1].tableData[i];
            }
          } else {
            this.tabs[1].tableData[i].cType = "";
            this.tabs[1].tableData[i].cDate = "";
            this.tabs[1].tableData[i].cName = "";
            this.tabs[1].tableData[i].cPlanDate = "";
            this.tabs[1].tableData[i].cState = "";
            table2[table2.length] = this.tabs[1].tableData[i];
          }
        }
        this.tabs[1].tableData2 = table2;
      });
      this.listLoading = false;
    },
    change(e) {
      this.tabIndex = e.index;
    },
    handleDownload() {
      this.$nextTick(function () {
        var wb = XLSX.utils.table_to_book(
          document.querySelector(".tableData" + this.tabIndex)
        );
        /* 获取二进制字符串作为输出 */
        var wbout = XLSX.write(wb, {
          bookType: "xlsx",
          bookSST: true,
          type: "array",
        });
        try {
          if (parseInt(this.tabIndex) === 0) {
            FileSaver.saveAs(
              new Blob([wbout], { type: "application/octet-stream" }),
              "医疗锐器伤登记报告表.xlsx"
            );
          }
          if (parseInt(this.tabIndex) === 1) {
            FileSaver.saveAs(
              new Blob([wbout], { type: "application/octet-stream" }),
              "血液体液暴露后登记报告表.xlsx"
            );
          }
        } catch (e) {}
        return wbout;
      });
    },
    formatJson(filterVal) {
      return this.tableData.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },

    sortChange(data) {
      const { prop, order } = data;
      this.tableData.reverse();
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    getSortClass: function (key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}` ? "ascending" : "descending";
    },
  },
};
</script>

<style lang="scss" scoped>
.add-plan-btn {
  position: absolute;
  top: 86px;
  right: 20px;
  z-index: 9;
}
.add-form {
  width: 100%;
  margin: 0 10px;
  max-height: 700px;
  overflow: auto;
  .menu-btn {
    position: absolute;
    bottom: 20px;
  }
}
.add-form-row {
  margin-bottom: 14px;
}

.app-container {
  background-color: #fff;
}

.search {
  padding: 30px 10px;
  display: flex;
  justify-content: space-between;

  .date-component {
    margin: 10px;
  }
}

.add-button {
  position: absolute;
  left: 10px;
  z-index: 2;
}

.out-icon {
  cursor: pointer;
  position: absolute;
  right: 15px;
  top: 12px;
}

.form-icon {
  color: #20a0ff;
  font-size: 22px;
  cursor: pointer;
}
</style>
