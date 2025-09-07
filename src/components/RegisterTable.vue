<template>
  <div>
    <h1>Total Misiones Registradas</h1>

    <div class="filters-bar">
      <div class="block">
        <el-select
          v-model="value"
          placeholder="Seleccione un Filtro"
          @change="handleChange"
          class="filter-select"
        >
          <el-option
            v-for="option in options"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </div>

      <el-input
        v-if="value && !isDateFilter"
        type="text"
        placeholder="Ingresé el valor a buscar ..."
        v-model="searchQuery"
        size="small"
        class="filter-input"
      />

      <el-date-picker
        v-if="value === 'date'"
        v-model="value1"
        type="daterange"
        range-separator="-"
        start-placeholder="Fecha inicio"
        end-placeholder="Fecha fin"
        size="small"
        class="filter-date"
      />

      <el-button
        @click="search"
        size="small"
        style="white-space: nowrap; margin-right: 8px"
      >
        Buscar
      </el-button>
      <el-button
        @click="clearFilters"
        size="small"
        type="info"
        style="white-space: nowrap"
      >
        Limpiar
      </el-button>
    </div>

    <el-table :data="launches" style="width: 100%; margin-bottom: 24px">
      <el-table-column prop="id" label="ID de Lanzamiento" width="180" />
      <el-table-column prop="mission_name" label="Misión" width="180" />
      <el-table-column prop="rocket_name" label="Cohete" width="180" />
      <el-table-column
        prop="launch_date"
        label="Fecha de Lanzamiento"
        width="180"
      />
      <el-table-column prop="status" label="Estado de Lanzamiento" />
      <el-table-column prop="details" label="Detalles" />
    </el-table>
    <div style="display: flex; justify-content: flex-end; padding: 16px 0">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="count"
        :page-size="limit"
        :current-page="currentPage"
        @current-change="handlePageChange"
        :hide-on-single-page="true"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "RegisterTable",
  computed: {
    isDateFilter() {
      return this.value === "date";
    },
  },
  data() {
    return {
      launches: [],
      count: 0,
      lastEvaluatedKey: null,
      hasMore: false,
      limit: 700,
      currentPage: 1,
      pageKeys: [null], // Store lastEvaluatedKey for each page
      value: "",
      value1: "",
      searchQuery: "",
      options: [
        {
          value: "mission_name",
          label: "Misión",
        },
        {
          value: "rocket",
          label: "Tipo de Cohete",
        },
        {
          value: "status",
          label: "Estado de Lanzamiento",
        },
        {
          value: "date",
          label: "Rango de Fecha",
        },
      ],
    };
  },
  methods: {
    async fetchLaunches(page = 1) {
      this.loading = true;
      try {
        let pageKey = this.pageKeys[page - 1] || null;
        let url = `${API_BASE_URL}/launches`;
        if (pageKey)
          url += `&last_evaluated_key=${encodeURIComponent(pageKey)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Error al obtener lanzamientos");
        const data = await res.json();
        this.launches = data.launches;
        this.count = data.count;
        this.lastEvaluatedKey = data.last_evaluated_key;
        this.hasMore = data.has_more;
        console.log("Fetched launches:", data);
        // Store the lastEvaluatedKey for the next page
        if (this.pageKeys.length < page) {
          this.pageKeys.push(this.lastEvaluatedKey);
        } else {
          this.pageKeys[page] = this.lastEvaluatedKey;
        }
      } catch (err) {
        this.launches = [];
        this.count = 0;
        this.lastEvaluatedKey = null;
        this.hasMore = false;
        this.$message &&
          this.$message.error("No se pudieron cargar los lanzamientos");
      } finally {
        this.loading = false;
      }
    },
    handleChange() {
      // Limpiar el campo de búsqueda cuando cambia el filtro
      this.searchQuery = "";
      this.value1 = "";
    },
    async search() {
      if (!this.value) {
        this.$message &&
          this.$message.warning("Por favor selecciona un filtro");
        return;
      }

      if (this.isDateFilter) {
        await this.searchByDateRange();
        return;
      }

      if (!this.searchQuery) {
        this.$message &&
          this.$message.warning("Por favor ingresa un valor para buscar");
        return;
      }

      this.loading = true;
      try {
        const body = {};
        body[this.value] = this.searchQuery;

        const res = await fetch(`${API_BASE_URL}/launches/filter`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!res.ok) throw new Error("Error al filtrar lanzamientos");
        const data = await res.json();

        this.launches = data.launches || [];
        this.count = data.count || this.launches.length;
        this.lastEvaluatedKey = data.last_evaluated_key;
        this.hasMore = data.has_more;
        this.currentPage = 1;
        this.pageKeys = [null];
      } catch (err) {
        console.error("Error al filtrar:", err);
        this.$message && this.$message.error("Error al filtrar lanzamientos");
        this.launches = [];
        this.count = 0;
      } finally {
        this.loading = false;
      }
    },
    async searchByDateRange() {
      if (
        !this.value1 ||
        !Array.isArray(this.value1) ||
        this.value1.length !== 2
      ) {
        this.$message &&
          this.$message.warning("Por favor selecciona un rango de fechas");
        return;
      }

      this.loading = true;
      try {
        // Obtener las fechas del date picker y ajustar a UTC
        const [startDate, endDate] = this.value1;

        // Configurar la fecha de inicio (00:00:00)
        const formattedStartDate = new Date(startDate);
        formattedStartDate.setUTCHours(0, 0, 0);

        // Configurar la fecha de fin (23:59:59)
        const formattedEndDate = new Date(endDate);
        formattedEndDate.setUTCHours(23, 59, 59);

        // Formatear las fechas manualmente sin milisegundos y sin Z
        const formatDate = (date) => {
          return date.toISOString().split(".")[0].replace("Z", "");
        };

        const startDateStr = formatDate(formattedStartDate);
        const endDateStr = formatDate(formattedEndDate);
        console.log("Fechas a buscar:", { startDateStr, endDateStr });

        const url = `${API_BASE_URL}/launches/date-range?start_date=${startDateStr}&end_date=${endDateStr}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Error al filtrar por fechas");

        const data = await res.json();
        this.launches = data.launches || [];
        this.count = data.count || this.launches.length;
        this.lastEvaluatedKey = data.last_evaluated_key;
        this.hasMore = data.has_more;
        this.currentPage = 1;
        this.pageKeys = [null];
      } catch (err) {
        console.error("Error al filtrar por fechas:", err);
        this.$message && this.$message.error("Error al filtrar por fechas");
        this.launches = [];
        this.count = 0;
      } finally {
        this.loading = false;
      }
    },
    clearFilters() {
      // Limpiar filtros y campos
      this.value = "";
      this.searchQuery = "";
      this.value1 = "";
      this.currentPage = 1;
      this.pageKeys = [null];

      // Recargar todos los lanzamientos
      this.fetchLaunches(1);
    },
    handlePageChange(page) {
      this.currentPage = page;
      this.fetchLaunches(page);
    },
  },
  mounted() {
    this.fetchLaunches(1);
  },
};
const API_BASE_URL =
  process.env.VUE_APP_API_BASE_URL || "http://localhost:8000/api/v1";
</script>

<style lang="scss" scoped>
.filters-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 20px;
  margin: 10px;
}
.filter-input {
  min-width: 140px;
  max-width: 200px;
  flex: 1 1 140px;
  margin: 10px;
}
.filter-select {
  min-width: 180px;
  margin-right: 10px;
}
.filter-date {
  min-width: 300px;
  margin: 0 10px;
}
@media (max-width: 600px) {
  .filters-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.demonstration {
  display: block;
  color: #8492a6;
  font-size: 14px;
  margin-bottom: 20px;
}
</style>
