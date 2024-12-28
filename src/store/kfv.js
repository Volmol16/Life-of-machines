import {
    defineStore
} from "pinia";
import {
    useAuthStore
} from "./auth";
import {
    ref
} from "vue";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL
export const useKFVStore = defineStore("KFV", {
    state: () => {
        return {
            loading: false,
            error: null,
            changesStructureKFV: {
                labels: [],
                datasets: []
            },
            filterParams: ref({
                yearStart: 2000,
                yearEnd: 2024,
                machineClassIds: 1,
                machineTypeIds: [],
            })
        }
    },
    actions: {
        async fetchKFV() {
            this.loading = true;
            this.error = null;
            const authStore = useAuthStore();
            const token = authStore.accessToken;

            if (!token) {
                this.error = "Токен не найден!";
                this.loading = false;
                return;
            }

            const {
                yearStart,
                yearEnd,
                machineClassIds,
                machineTypeIds
            } = this.filterParams;

            try {
                const response = await fetch(`${API_BASE_URL}/ctf/charts/structure?dateStart=${yearStart}&dateEnd=${yearEnd}&machineClassIds=${machineClassIds}&machineTypeIds=${machineTypeIds.join(',')}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(`HTTP error ${response.status}: ${text}`);
                }

                const data = await response.json();

                console.log("Полученные данные", data);

                this.changesStructureKFV = changesStructure(data);

            } catch (error) {
                this.error = `Ошибка при загрузке данных ${error.message}`;
            } finally {
                this.loading = false;
            }
        },
        updateFilterParams(params) {
            this.$patch(state => {
                Object.assign(state.filterParams, params);
            });
            this.fetchKFV();
        },
    }
})

function changesStructure(data) {
    const dataKeys = Object.keys(data);
    const labels = ['2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022'];

    if (!data || labels.length === 0) {
        console.warn("Данные от API пустые или неверного формата.");
        return {
            labels: [],
            datasets: []
        };
    }


    const datasets = [{
            label: "Время в работе",
            data: dataKeys.map(key => data[key]?.fact?.worktime_f || 0),
            backgroundColor: "#497daa",
            fill: true,
        },
        {
            label: 'План. простои',
            data: dataKeys.map(key => data[key]?.fact?.plannedOaTD_f + data[key]?.fact?.plannedRepair_f || 0),
            backgroundColor: '#848484',
            fill: true,
        },
        {
            label: 'Неплан.простои',
            data: dataKeys.map(key => data[key]?.fact?.unplannedOaTD_f + data[key]?.fact?.unplannedRepair_f || 0),
            backgroundColor: '#325aa3',
            fill: true,
        }
    ];

    console.log("Проверка datasets:", datasets.map(dataset => ({
        label: dataset.label,
        data: dataset.data
    })));

    return {
        labels,
        datasets
    };
}