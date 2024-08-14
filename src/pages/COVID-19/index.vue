<template>
  <div class="app-container">
    <el-form class="search" label-width="100px" size="small">
      <el-date-picker
        v-model="searchModel.startTime"
        class="date-component"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="选择起始日期"
      />
      <span>-</span>
      <el-date-picker
        v-model="searchModel.endTime"
        class="date-component"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="选择截止日期"
      />
      <el-button icon="el-icon-search" type="primary" @click="getData"
        >查询</el-button
      >
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
      v-loading="listLoading"
      :header-cell-style="{ 'background-color': '#fefefe', color: '#959595' }"
      border
      :data="
        tableData.slice(
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
        min-width="120px"
        fiexd
        align="center"
        prop="name"
        label="填报人"
      />
      <el-table-column min-width="120px" align="center" label="填报时间">
        <template slot-scope="scope">
          {{ scope.row.createTime.split("T")[0] }}
        </template>
      </el-table-column>
      <el-table-column
        min-width="220px"
        align="center"
        label="是否有工作人员出现新冠症状"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.result.person.length > 0">是</span>
          <span v-else>否</span>
        </template></el-table-column
      >
      <el-table-column min-width="120px" align="center" label="新冠人数">
        <template slot-scope="scope">
          <span style="color: #f66a6e; font-weight: 600">
            {{ scope.row.result.person.length }}
          </span>
        </template>
      </el-table-column>
      <el-table-column min-width="120px" align="center" label="新冠人员详情">
        <template slot-scope="scope">
          <svg-icon
            v-if="scope.row.result.person.length > 0"
            icon-class="person"
            class="person-icon"
            @click="personDetails(scope.row.result.person)"
          />
          <span v-else>-</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="listQuery.page"
      :page-size="listQuery.limit"
      layout="prev, pager, next, jumper"
      :total="tableData.length"
      @current-change="handleCurrentChange"
    />
    <el-dialog :visible.sync="drawer" title="感染人员表" width="70%">
      <el-table
        v-loading="listLoading"
        :header-cell-style="{ 'background-color': '#fefefe', color: '#959595' }"
        :data="selectTable"
        style="width: 100%"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="新冠疫苗接种情况：">
                <span>{{ props.row.JZQK }}</span>
              </el-form-item>
              <el-form-item label="末次新冠疫苗接种日期：">
                <span>{{ props.row.MCJZRQ }}</span>
              </el-form-item>
              <el-form-item label="日常工作中不接诊新冠患者时个人防护情况：">
                <span>{{ props.row.RCGZGRFHQK.toString() }}</span>
              </el-form-item>
              <el-form-item label="工作中是否直接接诊新冠患者：">
                <span>{{ props.row.GZZSFZJJZXGHZ }}</span>
              </el-form-item>
              <el-form-item label="接诊新冠患者个人防护情况：">
                <span>{{ props.row.JZXGHZGRFHQK.toString() }}</span>
              </el-form-item>
              <el-form-item label="是否有基础疾病：">
                <span v-if="props.row.SFYJCJB == '是'">{{
                  props.row.JCJB
                }}</span>
                <span v-else>{{ props.row.SFYJCJB }}</span>
              </el-form-item>
              <el-form-item label="2022年12月7日至今是否已经感染过新冠病毒：">
                <span>{{ props.row.ZJSFGR }}</span>
              </el-form-item>
              <el-form-item label="可能的感染来源是：">
                <span v-if="props.row.KNGRLY == '其他'">{{
                  props.row.QTGRLY
                }}</span>
                <span v-else>{{ props.row.KNGRLY }}</span>
              </el-form-item>
              <el-form-item label="您是如何确定自己感染了新冠病毒：">
                <span v-if="props.row.RHQDGR == '其他'">{{
                  props.row.QTQDGR
                }}</span>
                <span v-else>{{ props.row.RHQDGR }}</span>
              </el-form-item>
              <el-form-item label="第一次感染新冠病毒的日期：">
                <span>{{ props.row.DYCGRRQ }}</span>
              </el-form-item>
              <el-form-item label="第一次感染新冠病毒的症状及持续时长(天)：">
                <!-- <span>{{ props.row.DYCGRZZJCXSC.toString() }}</span> -->
              </el-form-item>
              <el-form-item label="低热37.2℃-38℃：">
                <span>{{ props.row.DRCXSC }}</span>
              </el-form-item>
              <el-form-item label="中度发热38.1℃-39℃：">
                <span>{{ props.row.ZRCXSC }}</span>
              </el-form-item>
              <el-form-item label="高热39.1℃-41℃：">
                <span>{{ props.row.GRCXSC }}</span>
              </el-form-item>
              <el-form-item label="超高热超过41℃：">
                <span>{{ props.row.CGRCXSC }}</span>
              </el-form-item>
              <el-form-item label="干咳：">
                <span>{{ props.row.GKCXSC }}</span>
              </el-form-item>
              <el-form-item label="乏力：">
                <span>{{ props.row.FLCXSC }}</span>
              </el-form-item>
              <el-form-item label="鼻塞："> </el-form-item>
              <el-form-item label="咽痛："> </el-form-item>
              <el-form-item label="流涕："> </el-form-item>
              <el-form-item label="肌痛：">
                <span>{{ props.row.JTCXSC }}</span>
              </el-form-item>
              <el-form-item label="腹泻："> </el-form-item>
              <el-form-item label="结膜炎：">
                <span>{{ props.row.JMYCXSC }}</span>
              </el-form-item>
              <el-form-item label="嗅觉味觉减退或丧失：">
                <span>{{ props.row.XWSSCXSC }}</span>
              </el-form-item>
              <el-form-item label="其他症状：">
                <span>{{ props.row.QTZZ }}</span>
              </el-form-item>
              <el-form-item label="第一次感染新冠病毒就医地点：">
                <span v-if="props.row.DYCGRJYDD == '其他'">{{
                  props.row.QTJYDD
                }}</span>
                <span v-else>{{ props.row.DYCGRJYDD }}</span>
              </el-form-item>
              <el-form-item label="第一次感染新冠病毒的病程多少天：">
                <span>{{ props.row.DYCGRBC }}</span>
              </el-form-item>
              <el-form-item label="第一次感染新冠病毒期间带病上岗的多少天：">
                <span>{{ props.row.DYCGRDBSG }}</span>
              </el-form-item>
              <el-form-item label="第一次感染新冠后心理感受：">
                <span v-if="props.row.DYCGRGS == '其他'">{{
                  props.row.QTGS
                }}</span>
                <span v-else>{{ props.row.DYCGRGS }}</span>
              </el-form-item>
              <el-form-item label="是否出现二次感染新冠病毒的情况：">
                <span>{{ props.row.SFCXECGR }}</span>
              </el-form-item>
              <el-form-item
                label="可能的感染来源是："
                v-if="props.row.SFCXECGR == '是'"
              >
                <span v-if="props.row.ECGRLY == '其他'">{{
                  props.row.ECQTGRLY
                }}</span>
                <span v-else>{{ props.row.ECGRLY }}</span>
              </el-form-item>
              <el-form-item
                label="您是如何确定自己感染了新冠病毒："
                v-if="props.row.SFCXECGR == '是'"
              >
                <span v-if="props.row.ECRHQDGR == '其他'">{{
                  props.row.ECQTQDGR
                }}</span>
                <span v-else>{{ props.row.ECRHQDGR }}</span>
              </el-form-item>
              <el-form-item
                label="第二次感染新冠病毒的日期："
                v-if="props.row.SFCXECGR == '是'"
              >
                <span>{{ props.row.ECGRRQ }}</span>
              </el-form-item>
              <el-form-item
                label="第二次感染新冠病毒的症状及持续时长(天)："
                v-if="props.row.SFCXECGR == '是'"
              >
                <!-- <span>{{ props.row.ECGRZZJCXSC }}</span> -->
              </el-form-item>
              <el-form-item
                label="低热37.2℃-38℃："
                v-if="props.row.SFCXECGR == '是'"
              >
                <span>{{ props.row.ECDRCXSC }}</span>
              </el-form-item>
              <el-form-item
                label="中度发热38.1℃-39℃："
                v-if="props.row.SFCXECGR == '是'"
              >
                <span>{{ props.row.ECZRCXSC }}</span>
              </el-form-item>
              <el-form-item
                label="高热39.1℃-41℃："
                v-if="props.row.SFCXECGR == '是'"
              >
                <span>{{ props.row.ECGRCXSC }}</span>
              </el-form-item>
              <el-form-item
                label="超高热超过41℃："
                v-if="props.row.SFCXECGR == '是'"
              >
                <span>{{ props.row.ECCGRCXSC }}</span>
              </el-form-item>
              <el-form-item label="干咳：" v-if="props.row.SFCXECGR == '是'">
                <span>{{ props.row.ECGKCXSC }}</span>
              </el-form-item>
              <el-form-item label="乏力：" v-if="props.row.SFCXECGR == '是'">
                <span>{{ props.row.ECFLCXSC }}</span>
              </el-form-item>
              <el-form-item label="鼻塞：" v-if="props.row.SFCXECGR == '是'">
              </el-form-item>
              <el-form-item label="咽痛：" v-if="props.row.SFCXECGR == '是'">
              </el-form-item>
              <el-form-item label="流涕：" v-if="props.row.SFCXECGR == '是'">
              </el-form-item>
              <el-form-item label="肌痛：" v-if="props.row.SFCXECGR == '是'">
                <span>{{ props.row.ECJTCXSC }}</span>
              </el-form-item>
              <el-form-item label="腹泻：" v-if="props.row.SFCXECGR == '是'">
              </el-form-item>
              <el-form-item label="结膜炎：" v-if="props.row.SFCXECGR == '是'">
                <span>{{ props.row.ECJMYCXSC }}</span>
              </el-form-item>
              <el-form-item
                label="嗅觉味觉减退或丧失："
                v-if="props.row.SFCXECGR == '是'"
              >
                <span>{{ props.row.ECXWSSCXSC }}</span>
              </el-form-item>
              <el-form-item
                label="其他症状："
                v-if="props.row.SFCXECGR == '是'"
              >
                <span>{{ props.row.ECQTZZ }}</span>
              </el-form-item>
              <el-form-item
                label="第二次感染新冠病毒就医地点："
                v-if="props.row.SFCXECGR == '是'"
              >
                <span v-if="props.row.ECJYDD == '其他'">{{
                  props.row.ECQTDD
                }}</span>
                <span v-else>{{ props.row.ECJYDD }}</span>
              </el-form-item>
              <el-form-item
                label="第二次感染新冠病毒的病程多少天："
                v-if="props.row.SFCXECGR == '是'"
              >
                <span>{{ props.row.ECGRBC }}</span>
              </el-form-item>
              <el-form-item
                label="第二次感染新冠病毒期间带病上岗的多少天："
                v-if="props.row.SFCXECGR == '是'"
              >
                <span>{{ props.row.ECGRDBSG }}</span>
              </el-form-item>
              <el-form-item
                label="第二次感染新冠后心理感受："
                v-if="props.row.SFCXECGR == '是'"
              >
                <span v-if="props.row.ECGRGS == '其他'">{{
                  props.row.ECQTGS
                }}</span>
                <span v-else>{{ props.row.ECGRGS }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="性别" prop="XB"> </el-table-column>
        <el-table-column label="出生日期" prop="CSRQ"> </el-table-column>
        <el-table-column label="联系电话" prop="LXDH"> </el-table-column>
        <el-table-column label="科室" prop="KS"> </el-table-column>
        <el-table-column label="职业类别" prop="ZYLB"> </el-table-column>
      </el-table>
    </el-dialog>
    <el-table
      hidden
      v-loading="listLoading"
      class="tableData"
      :header-cell-style="{ 'background-color': '#fefefe', color: '#959595' }"
      border
      :data="exportTable"
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column prop="XB" fiexd label="性别" />
      <el-table-column prop="CSRQ" fiexd label="出生日期" width="100" />
      <el-table-column prop="LXDH" fiexd label="联系电话" width="115" />
      <el-table-column prop="KS" fiexd label="科室" width="290" />
      <el-table-column fiexd label="职业类别">
        <template slot-scope="scope">
          <span v-if="scope.row.ZYLB == '其他'">{{ scope.row.QTZYLB }}</span>
          <span v-else>{{ scope.row.ZYLB }}</span>
        </template>
      </el-table-column>
      <el-table-column fiexd label="创建时间" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.cTime.split("T")[0] }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="JZQK" label="新冠疫苗接种情况" width="135" />
      <el-table-column prop="MCJZRQ" label="末次新冠疫苗接种日期" width="165" />
      <el-table-column
        prop="RCGZGRFHQK"
        label="日常工作中不接诊新冠患者时个人防护情况"
        width="290"
      />
      <el-table-column
        prop="GZZSFZJJZXGHZ"
        label="工作中是否直接接诊新冠患者"
        width="205"
      />
      <el-table-column
        prop="JZXGHZGRFHQK"
        label="接诊新冠患者个人防护情况"
        width="190"
      />
      <el-table-column label="是否有基础疾病" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.SFYJCJB == '是'">{{ scope.row.JCJB }}</span>
          <span v-else>{{ scope.row.SFYJCJB }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="ZJSFGR"
        label="2022年12月7日至今是否已经感染过新冠病毒"
        width="310"
      />
      <el-table-column prop="KNGRLY" label="可能的感染来源是" width="135">
        <template slot-scope="scope">
          <span v-if="scope.row.KNGRLY == '其他'">{{ scope.row.QTGRLY }}</span>
          <span v-else>{{ scope.row.KNGRLY }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="RHQDGR"
        label="您是如何确定自己感染了新冠病毒"
        width="235"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.RHQDGR == '其他'">{{ scope.row.QTQDGR }}</span>
          <span v-else>{{ scope.row.RHQDGR }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="DYCGRRQ"
        label="第一次感染新冠病毒的日期"
        width="190"
      />
      <el-table-column
        label="第一次感染新冠病毒的症状及持续时长(天)"
        width="260"
      >
        <el-table-column prop="DRCXSC" label="低热37.2℃-38℃" width="140" />
        <el-table-column prop="ZRCXSC" label="中度发热38.1℃-39℃" width="160" />
        <el-table-column prop="GRCXSC" label="高热39.1℃-41℃" width="140" />
        <el-table-column prop="CGRCXSC" label="超高热超过41℃" width="130" />
        <el-table-column prop="GKCXSC" label="干咳" width="120" />
        <el-table-column prop="FLCXSC" label="乏力" width="120" />
        <el-table-column label="鼻塞" width="120" />
        <el-table-column label="咽痛" width="120" />
        <el-table-column label="流涕" width="120" />
        <el-table-column prop="JTCXSC" label="肌痛" width="120" />
        <el-table-column label="腹泻" width="120" />
        <el-table-column prop="JMYCXSC" label="结膜炎" width="120" />
        <el-table-column
          prop="XWSSCXSC"
          label="嗅觉味觉减退或丧失"
          width="160"
        />
        <el-table-column prop="QTZZ" label="其他症状" width="130" />
      </el-table-column>
      <el-table-column
        prop="DYCGRJYDD"
        label="第一次感染新冠病毒就医地点"
        width="205"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.DYCGRJYDD == '其他'">{{
            scope.row.QTJYDD
          }}</span>
          <span v-else>{{ scope.row.DYCGRJYDD }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="DYCGRBC"
        label="第一次感染新冠病毒的病程多少天"
        width="235"
      />
      <el-table-column
        prop="DYCGRDBSG"
        label="第一次感染新冠病毒期间带病上岗的多少天"
        width="290"
      />
      <el-table-column
        prop="DYCGRGS"
        label="第一次感染新冠后心理感受"
        width="190"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.DYCGRGS == '其他'">{{ scope.row.QTGS }}</span>
          <span v-else>{{ scope.row.DYCGRGS }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="SFCXECGR"
        label="是否出现二次感染新冠病毒的情况"
        width="235"
      />
      <el-table-column prop="ECGRLY" label="可能的感染来源是" width="135">
        <template slot-scope="scope">
          <span v-if="scope.row.ECGRLY == '其他'">{{
            scope.row.ECQTGRLY
          }}</span>
          <span v-else>{{ scope.row.ECGRLY }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="ECRHQDGR"
        label="您是如何确定自己感染了新冠病毒"
        width="235"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.ECRHQDGR == '其他'">{{
            scope.row.ECQTQDGR
          }}</span>
          <span v-else>{{ scope.row.ECRHQDGR }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="ECGRRQ"
        label="第二次感染新冠病毒的日期"
        width="190"
      />
      <el-table-column
        label="第二次感染新冠病毒的症状及持续时长(天)"
        width="260"
      >
        <el-table-column prop="ECDRCXSC" label="低热37.2℃-38℃" width="140" />
        <el-table-column
          prop="ECZRCXSC"
          label="中度发热38.1℃-39℃"
          width="160"
        />
        <el-table-column prop="ECGRCXSC" label="高热39.1℃-41℃" width="140" />
        <el-table-column prop="ECCGRCXSC" label="超高热超过41℃" width="130" />
        <el-table-column prop="ECGKCXSC" label="干咳" width="120" />
        <el-table-column prop="ECFLCXSC" label="乏力" width="120" />
        <el-table-column label="鼻塞" width="120" />
        <el-table-column label="咽痛" width="120" />
        <el-table-column label="流涕" width="120" />
        <el-table-column prop="ECJTCXSC" label="肌痛" width="120" />
        <el-table-column label="腹泻" width="120" />
        <el-table-column prop="ECJMYCXSC" label="结膜炎" width="120" />
        <el-table-column
          prop="ECXWSSCXSC"
          label="嗅觉味觉减退或丧失"
          width="160"
        />
        <el-table-column prop="ECQTZZ" label="其他症状" width="130" />
      </el-table-column>
      <el-table-column
        prop="ECJYDD"
        label="第二次感染新冠病毒就医地点"
        width="205"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.ECJYDD == '其他'">{{ scope.row.ECQTDD }}</span>
          <span v-else>{{ scope.row.ECJYDD }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="ECGRBC"
        label="第二次感染新冠病毒的病程多少天"
        width="235"
      />
      <el-table-column
        prop="ECGRDBSG"
        label="第二次感染新冠病毒期间带病上岗的多少天"
        width="290"
      />
      <el-table-column
        prop="ECGRGS"
        label="第二次感染新冠后心理感受"
        width="190"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.ECGRGS == '其他'">{{ scope.row.ECQTGS }}</span>
          <span v-else>{{ scope.row.ECGRGS }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { getAll } from "@/api/COVID-19";

export default {
  name: "HealthEducation",
  components: {
    Pagination,
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
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
      tableData: [],
      drawer: false,
      selectTable: [],
      exportTable: [],
    };
  },
  created() {
    this.getData();
  },
  methods: {
    personDetails(person) {
      this.selectTable = person;
      this.drawer = true;
    },
    handleCurrentChange(page) {
      this.listQuery.page = page;
    },
    getData() {
      this.tableData = [];
      getAll(this.searchModel).then((res) => {
        switch (this.$store.state.user.userInfo.Power) {
          case 3:
            this.tableData = JSON.parse(res.d);
            break;
          default:
            JSON.parse(res.d).forEach((v) => {
              if (v.KS === this.$store.state.user.userInfo.Department) {
                this.tableData.push(v);
              }
            });
            break;
        }
        this.filters();
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].result = JSON.parse(this.tableData[i].result);
        }
        const table = [];
        for (let i = 0; i < this.tableData.length; i++) {
          for (let j = 0; j < this.tableData[i].result.person.length; j++) {
            this.tableData[i].result.person[j].cTime =
              this.tableData[i].createTime;
            table[table.length] = this.tableData[i].result.person[j];
          }
        }
        this.exportTable = table;
      });
      this.listLoading = false;
    },
    clearLast(idx) {
      this.tableData[idx].ECGRLY = "";
      this.tableData[idx].ECQTGRLY = "";
      this.tableData[idx].ECRHQDGR = "";
      this.tableData[idx].ECQTQDGR = "";
      this.tableData[idx].ECGRRQ = "";
      this.tableData[idx].ECGRZZJCXSC = "";
      this.tableData[idx].ECDRCXSC = "";
      this.tableData[idx].ECZRCXSC = "";
      this.tableData[idx].ECGRCXSC = "";
      this.tableData[idx].ECCGRCXSC = "";
      this.tableData[idx].ECGKCXSC = "";
      this.tableData[idx].ECFLCXSC = "";
      this.tableData[idx].ECJTCXSC = "";
      this.tableData[idx].ECJMYCXSC = "";
      this.tableData[idx].ECXWSSCXSC = "";
      this.tableData[idx].ECQTZZ = "";
      this.tableData[idx].ECJYDD = "";
      this.tableData[idx].ECQTDD = "";
      this.tableData[idx].ECGRBC = "";
      this.tableData[idx].ECGRDBSG = "";
      this.tableData[idx].ECGRGS = "";
      this.tableData[idx].ECQTGS = "";
    },
    clearAll(idx) {
      this.tableData[idx].KNGRLY = "";
      this.tableData[idx].QTGRLY = "";
      this.tableData[idx].RHQDGR = "";
      this.tableData[idx].QTQDGR = "";
      this.tableData[idx].DYCGRRQ = "";
      this.tableData[idx].DYCGRZZJCXSC = "";
      this.tableData[idx].JZXGHZGRFHQK = "";
      this.tableData[idx].DRCXSC = "";
      this.tableData[idx].ZRCXSC = "";
      this.tableData[idx].GRCXSC = "";
      this.tableData[idx].CGRCXSC = "";
      this.tableData[idx].GKCXSC = "";
      this.tableData[idx].FLCXSC = "";
      this.tableData[idx].JTCXSC = "";
      this.tableData[idx].JMYCXSC = "";
      this.tableData[idx].XWSSCXSC = "";
      this.tableData[idx].QTZZ = "";
      this.tableData[idx].DYCGRJYDD = "";
      this.tableData[idx].QTJYDD = "";
      this.tableData[idx].DYCGRBC = "";
      this.tableData[idx].DYCGRDBSG = "";
      this.tableData[idx].DYCGRGS = "";
      this.tableData[idx].QTGS = "";
      this.tableData[idx].SFCXECGR = "";
      this.clearLast(idx);
    },
    filters() {
      this.tableData.forEach((item, index) => {
        if (item.JZQK === "未接种") {
          this.tableData[index].MCJZRQ = "";
        }
        if (item.GZZSFZJJZXGHZ === "否") {
          this.tableData[index].JZXGHZGRFHQK = "";
        }
        if (item.ZJSFGR === "否") {
          this.clearAll(index);
        }
        if (item.SFCXECGR === "否") {
          this.clearLast(index);
        }
      });
    },
    handleDownload() {
      this.currentPage = 1; // 当前页为第一页
      this.listQuery.limit = this.tableData.length; // 每页大小限制条数：为总条数（将表格数据全部渲染出来在第一页上）
      this.$nextTick(function () {
        var wb = XLSX.utils.table_to_book(document.querySelector(".tableData"));
        /* 获取二进制字符串作为输出 */
        var wbout = XLSX.write(wb, {
          bookType: "xlsx",
          bookSST: true,
          type: "array",
        });
        try {
          FileSaver.saveAs(
            new Blob([wbout], { type: "application/octet-stream" }),
            "新冠相关.xlsx"
          );
        } catch (e) {}
        this.listQuery.limit = 10; // 导出之后再恢复原样，每页大小为限制条数为15条
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
      this.getData();
    },
    getSortClass: function (key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}` ? "ascending" : "descending";
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  background-color: #fff;
}

.search {
  padding: 20px 0;

  .date-component {
    margin: 10px;
  }
}

.add-button {
  position: absolute;
  left: 10px;
  z-index: 2;
}

.person-icon {
  font-size: 22px;
  cursor: pointer;
  fill: #5799fb;
}

.out-icon {
  cursor: pointer;
  position: absolute;
  right: 15px;
  top: 12px;
}
</style>
