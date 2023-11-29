<template>
    <t-progress
    v-if="loading"
    class="home-progress"
    :percentage="percent"
    :label="localString.loading[local.name] + ' ' + Math.ceil(percent) + '%'"
    />
    <t-row :gutter="[12, 12]" v-if="!loading" style="width: 100%; padding: 15px;">
        <t-col :span="12">
            <div style="padding: 0 10px; font-size: 16px;">
                {{ localString.welcomeBack[local.name] }}！{{ data.famousWord }}
            </div>
        </t-col>
        <t-col :span="9">
            <t-card :bordered="false">
                <template #title>
                    <img src="https://cdn.fixeam.com/tw/TW.png" v-if="shop.brand == '兔皇'" height="20" >
                    <img src="https://cdn.fixeam.com/tw/NT.png" v-if="shop.brand == 'NT'" height="20" >
                    <img src="https://cdn.fixeam.com/tw/DR.png" v-if="shop.brand == 'DR'" height="20" >
                    <img src="https://cdn.fixeam.com/tw/KCOR.png" v-if="shop.brand == 'KCOR'" height="20" >
                </template>
                <template #actions>
                    {{ dayjs().subtract(1, 'day').format('YYYY-MM-DD') }}
                </template>
                <t-alert v-if="data.day.sales.count == 0 && data.day.refunds.count == 0" >
                    {{ localString.unUpload[local.name] }}
                    <template #operation>
                        <span @click="$router.push('/import')">{{ localString.upload[local.name] }}</span>
                    </template>
                </t-alert>
                <div class="day-sales" v-if="data.day.sales.count != 0 || data.day.refunds.count != 0">
                    <t-statistic :animation-start="true" :animation="{ duration: 2, valueFrom: 0 }" :title="localString.salesCount[local.name]" :value="data.day.sales.count" :unit="localString.piece[local.name]" />
                    <t-statistic :animation-start="true" :animation="{ duration: 2, valueFrom: 0 }" :title="localString.salesAmount[local.name]" :value="data.day.sales.amount" :unit="localString.yuan[local.name]" />
                    <t-statistic :animation-start="true" :animation="{ duration: 2, valueFrom: 0 }" :title="localString.refundsCount[local.name]" :value="data.day.refunds.count" :unit="localString.piece[local.name]" />
                    <t-statistic :animation-start="true" :animation="{ duration: 2, valueFrom: 0 }" :title="localString.refundsAmount[local.name]" :value="data.day.refunds.amount" :unit="localString.yuan[local.name]" />
                    <t-statistic :animation-start="true" :animation="{ duration: 2, valueFrom: 0 }" :title="localString.actualSalesAmount[local.name]" :value="Math.round(data.day.sales.amount - data.day.refunds.amount)" :unit="localString.yuan[local.name]" />
                    <t-statistic :animation-start="true" :animation="{ duration: 2, valueFrom: 0 }" :title="localString.income[local.name]" :value="Math.round(data.day.sales.income - data.day.refunds.income)" :unit="localString.yuan[local.name]" />
                </div>
            </t-card>
            <t-card :bordered="false" style="margin-top: 12px;">
                <template #title>
                    <t-icon name="chart"></t-icon>
                    {{ localString.recentData[local.name] }}
                </template>
                <div ref="mainChart" style="width: 100%; height: 450px;"></div>
            </t-card>
            <t-row :gutter="[12, 12]" style="margin-top: 12px;">
                <t-col
                :span="6"
                v-for="item in ['goods', 'supplier']"
                :key="item"
                >
                    <t-card :bordered="false">
                        <template #title>
                            <span>
                                <t-icon name="chart-bubble"></t-icon>
                                {{ item == 'goods' ? localString.stylenumber[local.name] : localString.supplier[local.name] }} {{ localString.rank[local.name] }}
                            </span>
                            <t-tooltip :content="localString.tip1[local.name]">
                                <t-icon name="help-circle" :style="{
                                    color: '#aaa',
                                    cursor: 'pointer',
                                    marginLeft: '8px'
                                }"/>
                            </t-tooltip>
                        </template>
                        <t-table
                        size="small"
                        :key="data[item]"
                        :data="data[item]"
                        :columns="[
                            {
                                title: item == 'goods' ? localString.stylenumber[local.name] : localString.supplier[local.name],
                                colKey: item == 'goods' ? 'stylenumber' : 'supplier',
                                width: 100,
                                ellipsis: true,
                                tooltip: true,
                                align: 'center'
                            },
                            {
                                title: localString.salesCount[local.name],
                                colKey: 'salesCount',
                                sortType: 'all',
                                sorter: true,
                                width: 100,
                                align: 'center'
                            },
                            {
                                title: localString.salesAmount[local.name],
                                colKey: 'salesAmount',
                                sortType: 'all',
                                sorter: true,
                                width: 100,
                                align: 'center'
                            },
                            {
                                title: localString.refundsCount[local.name],
                                colKey: 'refundsCount',
                                sortType: 'all',
                                sorter: true,
                                width: 100,
                                align: 'center'
                            },
                            {
                                title: localString.refundsAmount[local.name],
                                colKey: 'refundsAmount',
                                sortType: 'all',
                                sorter: true,
                                width: 100,
                                align: 'center'
                            }
                        ]"
                        :bordered="false"
                        @sort-change="(val) => {
                            sortValue[item] = val
                            data[item] = sort(val, data[item], { sortBy: 'salesCount', descending: true })
                        }"
                        :sort="sortValue[item]"
                        show-sort-column-bg-color
                        height="450px"
                        :row-key="item == 'goods' ? 'stylenumber' : 'supplier'"
                        ></t-table>
                    </t-card>
                </t-col>
            </t-row>
        </t-col>
        <t-col :span="3">
            <t-card :bordered="false">
                <template #title>
                    <t-icon name="work-history"></t-icon>
                    {{ localString.recent[local.name] }}
                </template>
                <div style="text-align: center;" v-if="history.length == 0">
                    {{ localString.none[local.name] }}{{ localString.recent[local.name] }}~
                </div>
                <t-space break-line size="10px" :key="history">
                    <t-tag
                    v-for="item in history"
                    :key="item.name"
                    @click="$router.push(item.path)"
                    size="large"
                    style="cursor: pointer;"
                    variant="outline"
                    >
                        <template #icon>
                            <img :src="item.meta.avatar" height="20" >
                        </template>
                        {{ item.meta.title[local.name] }} ( {{ item.path }} )
                    </t-tag>
                </t-space>
            </t-card>
            <t-card :bordered="false" style="margin-top: 12px;">
                <template #title>
                    <t-icon name="star"></t-icon>
                    {{ localString.collection[local.name] }}
                </template>
                <div style="text-align: center;" v-if="collectionPath.length == 0">
                    {{ localString.none[local.name] }}{{ localString.collection[local.name] }}~
                </div>
                <t-space break-line size="10px" :key="collectionPath">
                    <t-tag
                    v-for="item in collectionPath"
                    :key="item.name"
                    @click="$router.push(item.path)"
                    size="large"
                    style="cursor: pointer;"
                    variant="outline"
                    >
                        <template #icon>
                            <img :src="item.meta.avatar" height="20" >
                        </template>
                        {{ item.meta.title[local.name] }} ( {{ item.path }} )
                    </t-tag>
                </t-space>
            </t-card>
            <t-card :bordered="false" style="margin-top: 12px;">
                <template #title>
                    <t-icon name="shop"></t-icon>
                    {{ localString.recommend[local.name] }}
                </template>
                <t-tabs :default-value="shop.brand">
                    <t-tab-panel
                    v-for="item, index in shop.brandOptions"
                    :key="index"
                    :value="item.value"
                    :label="item.label"
                    >
                        <div class="home-goods-list">
                            <t-card
                            :bordered="false"
                            class="next-good-item"
                            v-for="goods in data.ranks"
                            :key="goods.stylenumber"
                            v-show="goods.brand == item.value"
                            @contextmenu.prevent.stop="createContextMenu($event, item)"
                            shadow
                            >
                                <t-image
                                class="next-good-item-image"
                                :src="goods['main-image'] == null ? '' : JSON.parse(goods['main-image'])[0]"
                                >
                                </t-image>
                                <div class="next-good-item-info">
                                    <div class="prev-good-item-info-name" style="font-size: 13px; line-height: 15px;">
                                        <t-tag
                                        size="small"
                                        theme="primary"
                                        variant="light"
                                        >
                                            {{ goods['store-id'] }}
                                        </t-tag>
                                        <t-tooltip :content="goods.name">
                                            {{ goods.name }}
                                        </t-tooltip>
                                    </div>
                                    <div
                                    :style="{
                                        margin: '10px 0'
                                    }"
                                    >
                                        <span class="number-show">
                                            {{ goods.salesCount }}
                                        </span>
                                        {{ localString.piece[local.name] }}
                                        /
                                        <span class="number-show">
                                            {{ goods.salesAmount }}
                                        </span>
                                        {{ localString.yuan[local.name] }}
                                    </div>
                                    <t-button
                                    v-if="goods['miaostreet-id'] != null"
                                    size="small"
                                    @click.stop="() => {}"
                                    >
                                        <template #icon>
                                            <t-icon name="browse"></t-icon>
                                        </template>
                                        查看商品
                                    </t-button>
                                </div>
                            </t-card>
                        </div>
                    </t-tab-panel>
                </t-tabs>
            </t-card>
        </t-col>
    </t-row>
</template>

<script>
import localString from './local'
import moreLang from './moreLang'
import dayjs from 'dayjs'
import * as echarts from 'echarts'
import { translate, sort } from '../../hooks/apis'

export default {
    setup(){
        for (const lang in moreLang) {
            for (const key in moreLang[lang]) {
                localString[key][lang] = moreLang[lang][key]
            }
        }

        const loading = ref(true)
        const percent = ref(0)
        const serve = inject('serve')
        const shop = inject('shop')
        const local = inject('local')

        const data = ref({
            famousWord: '',
            day: {},
            week: [],
            goods: [],
            supplier: [],
            ranks: [],
            year: {}
        })
        const mainChart = ref(null)
        let charts

        const famousWord = async () => {
            return fetch(serve + "/famous-word")
            .then((response) => {
                return Promise.resolve(response.json())
            })
            .catch(() => {
                MessagePlugin.error(localString.httpFail[local.name])
            })
        }
        const daySales = async () => {
            return fetch(serve + '/analysis/sum?store-id=' + shop.store + '&brand=' + shop.brand + '&mode=日&time=' + dayjs().subtract(1, 'day').format('YYYY-MM-DD'))
            .then(res => {
                return Promise.resolve(res.json())
            })
            .catch(() => {
                MessagePlugin.error(localString.httpFail[local.name])
            })
        }
        const annualOverview = async () => {
            return fetch(serve + '/analysis/annual-overview?store-id=' + shop.store + '&brand=' + shop.brand)
            .then(res => {
                return Promise.resolve(res.json())
            })
            .catch(() => {
                MessagePlugin.error(localString.httpFail[local.name])
            })
        }
        const goodsRanks = async () => {
            return fetch(serve + '/goods/mirros')
            .then(res => {
                return Promise.resolve(res.json())
            })
            .catch(() => {
                MessagePlugin.error(localString.httpFail[local.name])
            })
        }

        const initData = async () => {
            loading.value = true

            let f = await famousWord()
            data.value.famousWord = f.hitokoto + ' 来自《' + f.works + '》'
            if(f.author && f.author != undefined && f.author != null){
                data.value.famousWord += f.author
            }
            data.value.famousWord += '。'
            translate(data.value.famousWord, local.name)
            .then(res => {
                data.value.famousWord = res.trans_result[0].dst
            })
            percent.value = 25

            data.value.day = await daySales()
            for (const sum in data.value.day) {
                for (const key in data.value.day[sum]) {
                    if (data.value.day[sum][key] == null) {
                        data.value.day[sum][key] = 0
                    }
                }
            }
            percent.value = 50

            let ao = await annualOverview()
            data.value.year.income = ao.income
            data.value.year.ordersCount = ao.ordersCount
            data.value.year.salesCount = ao.salesCount
            data.value.year.productsCount = ao.productsCount
            data.value.week = ao.nearlyWeek
            data.value.supplier = ao.ms.supplier
            data.value.goods = ao.ms.product
            percent.value = 75

            data.value.ranks = await goodsRanks()
            percent.value = 1

            loading.value = false
            initChart()
        }
        const initChart = () => {
            let chartsData = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: [localString.salesAmount[local.name], localString.refundsAmount[local.name], localString.income[local.name]]
                },
                xAxis: {
                    type: 'category',
                    nameLocation: 'middle',
                    boundaryGap: false,
                    data: []
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        type: 'bar',
                        barMaxWidth: 30,
                        itemStyle: {
                            borderRadius: 5,
                        },
                        name: localString.salesAmount[local.name],
                        data: [],
                        showSymbol: false,
                        smooth: true
                    },
                    {
                        type: 'bar',
                        barMaxWidth: 30,
                        itemStyle: {
                            borderRadius: 5,
                        },
                        name: localString.refundsAmount[local.name],
                        data: [],
                        showSymbol: false,
                        smooth: true
                    },
                    {
                        type: 'line',
                        name: localString.income[local.name],
                        data: [],
                        showSymbol: false,
                        smooth: true
                    }
                ]
            }

            let lin = data.value.week
            for (let i = 0; i < lin.length; i++) {
                chartsData.xAxis.data.push(lin[i].time)

                chartsData.series[0].data.push(lin[i].salesAmount)
                chartsData.series[1].data.push(lin[i].refundsAmount)
                chartsData.series[2].data.push(lin[i].income)
            }

            setTimeout(() => {
                charts = echarts.init(mainChart.value)
                mainChart.value.removeAttribute('_echarts_instance_')
                charts.clear()
                charts.setOption(chartsData)

                window.addEventListener("resize", function () {
                    charts.resize()
                })
            }, 100)
        }
        

        const sortValue = ref({
            'goods': null,
            'supplier': null
        })
        const history = ref([])
        const collectionPath = ref([])

        onMounted(() => {
            initData()

            setInterval(() => {
                history.value = JSON.parse(localStorage.getItem('history')) || []
                collectionPath.value = JSON.parse(localStorage.getItem('collection')) || []
            }, 500)
        })
        watch(() => shop.store, () => {
            initData()
        })
        watch(() => shop.brand, () => {
            initData()
        })

        return{
            dayjs,
            percent,
            loading,
            shop,
            data,
            local,
            localString,
            mainChart,
            sort,
            sortValue,
            history,
            collectionPath
        }
    }
}
</script>

<style>
.home-progress{
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 450px;
}
.day-sales{
    display: flex;
    padding: 20px 7%;
    gap: 6%;
}
.day-sales .t-statistic{
    flex-shrink: 0;
    min-width: 11.5%;
}
.home-goods-list{
    padding: 10px 3px;
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-gap: 10px;
    max-height: 500px;
    overflow-y: auto;
}
.next-good-item{
    flex-shrink: 0;
    flex-grow: 1;
    width: 100%;
    overflow: hidden;
}
.next-good-item .t-card__body{
    display: flex;
    padding: 0;
}
.next-good-item-image{
    width: 140px;
    height: 140px;
    flex-shrink: 0;
}
.next-good-item-info{
    padding: 12px 16px;
    box-sizing: border-box;
}
.number-show{
    font-size: 20px;
    font-family: 'DIN', serif;
    color: #f6685d;
}
.prev-good-item-info-name{
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin: 3px 0;
}
</style>