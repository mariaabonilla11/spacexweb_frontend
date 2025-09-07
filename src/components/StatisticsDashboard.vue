<template>
  <div class="statistics-dashboard">
    <el-row :gutter="20">
      <!-- Total Launches Card -->
      <el-col :span="6">
        <el-card class="stat-card total" shadow="hover">
          <div class="stat-icon">
            <i class="el-icon-data-line"></i>
          </div>
          <div class="stat-content">
            <h3>Total Lanzamientos</h3>
            <div class="stat-number">{{ stats.total_launches }}</div>
          </div>
        </el-card>
      </el-col>

      <!-- Successful Launches Card -->
      <el-col :span="6">
        <el-card class="stat-card success" shadow="hover">
          <div class="stat-icon">
            <i class="el-icon-check"></i>
          </div>
          <div class="stat-content">
            <h3>Lanzamientos Exitosos</h3>
            <div class="stat-number">{{ stats.successful_launches }}</div>
          </div>
        </el-card>
      </el-col>

      <!-- Failed Launches Card -->
      <el-col :span="6">
        <el-card class="stat-card danger" shadow="hover">
          <div class="stat-icon">
            <i class="el-icon-close"></i>
          </div>
          <div class="stat-content">
            <h3>Lanzamientos Fallidos</h3>
            <div class="stat-number">{{ stats.failed_launches }}</div>
          </div>
        </el-card>
      </el-col>

      <!-- Success Rate Card -->
      <el-col :span="6">
        <el-card class="stat-card info" shadow="hover">
          <div class="stat-icon">
            <i class="el-icon-star-on"></i>
          </div>
          <div class="stat-content">
            <h3>Tasa de Éxito</h3>
            <div class="stat-number">{{ stats.success_rate }}%</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Rockets Usage Section -->
    <el-row :gutter="20" class="rockets-section">
      <el-col :span="24">
        <el-card class="rocket-stats" shadow="hover">
          <div slot="header" class="clearfix">
            <span>Cohetes Más Utilizados</span>
          </div>
          <el-table :data="stats.most_used_rockets" style="width: 100%">
            <el-table-column
              prop="rocket_name"
              label="Nombre del Cohete"
            ></el-table-column>
            <el-table-column prop="count" label="Cantidad de Lanzamientos">
              <template slot-scope="scope">
                <el-progress
                  :percentage="getPercentage(scope.row.count)"
                  :format="format"
                ></el-progress>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "StatisticsDashboard",
  data() {
    return {
      stats: {
        total_launches: 0,
        successful_launches: 0,
        failed_launches: 0,
        upcoming_launches: 0,
        success_rate: 0,
        most_used_rockets: [],
      },
    };
  },
  methods: {
    async fetchStats() {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/launches/stats/summary"
        );
        this.stats = response.data;
      } catch (error) {
        this.$message.error("Error al cargar las estadísticas");
        console.error("Error:", error);
      }
    },
    getPercentage(count) {
      if (!this.stats.total_launches) return 0;
      return Math.round((count / this.stats.total_launches) * 100);
    },
    format(percentage) {
      return `${percentage}%`;
    },
  },
  created() {
    this.fetchStats();
  },
};
</script>

<style scoped>
.statistics-dashboard {
  padding: 20px;
}

.stat-card {
  height: 120px;
  display: flex;
  align-items: center;
  padding: 20px;
}

.stat-icon {
  font-size: 40px;
  margin-right: 15px;
}

.stat-content {
  flex-grow: 1;
}

.stat-content h3 {
  margin: 0;
  font-size: 16px;
  color: #606266;
}

.stat-number {
  font-size: 28px;
  font-weight: bold;
  margin-top: 10px;
}

.total {
  background: linear-gradient(135deg, #409eff11 0%, #409eff22 100%);
}

.success {
  background: linear-gradient(135deg, #67c23a11 0%, #67c23a22 100%);
}

.danger {
  background: linear-gradient(135deg, #f56c6c11 0%, #f56c6c22 100%);
}

.info {
  background: linear-gradient(135deg, #e6a23d11 0%, #e6a23d22 100%);
}

.rockets-section {
  margin-top: 20px;
}

.rocket-stats {
  margin-bottom: 20px;
}

.el-progress {
  margin: 10px 0;
}

.clearfix {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
