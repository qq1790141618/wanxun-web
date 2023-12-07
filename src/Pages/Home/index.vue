<template>
    <t-progress
    v-if="loading"
    class="home-progress"
    :percentage="percent"
    :label="i18n.loading[i18n.language] + ' ' + Math.ceil(percent) + '%'"
    />
    <t-row :gutter="[12, 12]" v-if="!loading" style="width: 100%; padding: 15px;">
        <t-col :span="12">
            <div style="padding: 0 10px; font-size: 15px;">
                {{ i18n.welcomeBack[i18n.language] }}！{{ data.famousWord }}
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
                    {{ i18n.unUpload[i18n.language] }}
                    <template #operation>
                        <span @click="$router.push('/import')">{{ i18n.upload[i18n.language] }}</span>
                    </template>
                </t-alert>
                <div class="day-sales" v-if="data.day.sales.count != 0 || data.day.refunds.count != 0">
                    <t-statistic :animation-start="true" :animation="{ duration: 2, valueFrom: 0 }" :title="i18n.salesCount[i18n.language]" :value="data.day.sales.count" :unit="i18n.piece[i18n.language]" />
                    <t-statistic :animation-start="true" :animation="{ duration: 2, valueFrom: 0 }" :title="i18n.salesAmount[i18n.language]" :value="data.day.sales.amount" :unit="i18n.yuan[i18n.language]" />
                    <t-statistic :animation-start="true" :animation="{ duration: 2, valueFrom: 0 }" :title="i18n.refundsCount[i18n.language]" :value="data.day.refunds.count" :unit="i18n.piece[i18n.language]" />
                    <t-statistic :animation-start="true" :animation="{ duration: 2, valueFrom: 0 }" :title="i18n.refundsAmount[i18n.language]" :value="data.day.refunds.amount" :unit="i18n.yuan[i18n.language]" />
                    <t-statistic :animation-start="true" :animation="{ duration: 2, valueFrom: 0 }" :title="i18n.actualSalesAmount[i18n.language]" :value="Math.round(data.day.sales.amount - data.day.refunds.amount)" :unit="i18n.yuan[i18n.language]" />
                    <t-statistic :animation-start="true" :animation="{ duration: 2, valueFrom: 0 }" :title="i18n.income[i18n.language]" :value="Math.round((data.day.sales.income - data.day.refunds.income) * 100) / 100" :unit="i18n.yuan[i18n.language]" />
                </div>
            </t-card>
            <t-card :bordered="false" style="margin-top: 12px;">
                <template #title>
                    <t-icon name="chart"></t-icon>
                    <span style="vertical-align: middle; margin-left: 8px;">
                        {{ i18n.recentData[i18n.language] }}
                    </span>
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
                                <span style="vertical-align: middle; margin-left: 8px;">
                                    {{ item == 'goods' ? i18n.stylenumber[i18n.language] : i18n.supplier[i18n.language] }} {{ i18n.rank[i18n.language] }}
                                </span>
                            </span>
                            <t-tooltip :content="i18n.tip0[i18n.language]">
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
                                title: item == 'goods' ? i18n.stylenumber[i18n.language] : i18n.supplier[i18n.language],
                                colKey: item == 'goods' ? 'stylenumber' : 'supplier',
                                width: 100,
                                ellipsis: true,
                                tooltip: true,
                                align: 'center'
                            },
                            {
                                title: i18n.salesCount[i18n.language],
                                colKey: 'salesCount',
                                sortType: 'all',
                                sorter: true,
                                width: 100,
                                align: 'center'
                            },
                            {
                                title: i18n.salesAmount[i18n.language],
                                colKey: 'salesAmount',
                                sortType: 'all',
                                sorter: true,
                                width: 100,
                                align: 'center'
                            },
                            {
                                title: i18n.refundsCount[i18n.language],
                                colKey: 'refundsCount',
                                sortType: 'all',
                                sorter: true,
                                width: 100,
                                align: 'center'
                            },
                            {
                                title: i18n.refundsAmount[i18n.language],
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
                    <span style="vertical-align: middle; margin-left: 8px;">
                        {{ i18n.recent[i18n.language] }}
                    </span>
                </template>
                <template #actions>
                    <t-button variant="text" theme="primary" size="small" @click="clearHistory">
                        <template #icon>
                            <t-icon name="clear"></t-icon>
                        </template>
                    </t-button>
                </template>
                <div style="text-align: center;" v-if="history.menus.length == 0 && history.goods.length == 0">
                    {{ i18n.none[i18n.language] }}{{ i18n.recent[i18n.language] }}~
                </div>
                <t-tabs default-value="menus" v-if="history.menus.length != 0 || history.goods.length != 0">
                    <t-tab-panel
                    v-for="gruop, index in ['menus', 'goods']"
                    :key="index"
                    :value="gruop"
                    :label="i18n[gruop][i18n.language]"
                    :disabled="!history[gruop] || history[gruop].length == 0"
                    >
                        <t-space break-line size="10px" style="margin-top: 10px;" :key="history[gruop]" v-if="history[gruop] && history[gruop].length > 0">
                            <t-check-tag
                            v-for="item in history[gruop]"
                            :key="item.name"
                            @click="() => {
                                if(item.path){
                                    $router.push(item.path)
                                } else {
                                    miaostreetGoodsLink(item)
                                }
                            }"
                            size="large"
                            style="cursor: pointer;"
                            variant="outline"
                            >
                                <img v-if="gruop == 'menus'" :src="item.meta.avatar" height="20" style="margin-right: 5px;" >
                                <span v-if="gruop == 'menus'">
                                    {{ i18n[item.meta.title][i18n.language] }} ( {{ item.path }} )
                                </span>
                                <img v-if="gruop == 'goods'" :src="item['main-image'] == null ? '' : JSON.parse(item['main-image'])[0]" height="20" style="margin-right: 5px;" >
                                <span v-if="gruop == 'goods'">
                                    {{ item.brand + ': ' + item.stylenumber }}
                                </span>
                            </t-check-tag>
                        </t-space>
                    </t-tab-panel>
                </t-tabs>
            </t-card>
            <t-card :bordered="false" style="margin-top: 12px;">
                <template #title>
                    <t-icon name="star"></t-icon>
                    <span style="vertical-align: middle; margin-left: 8px;">
                        {{ i18n.collection[i18n.language] }}
                    </span>
                </template>
                <div style="text-align: center;" v-if="collectionPath.length == 0">
                    {{ i18n.none[i18n.language] }}{{ i18n.collection[i18n.language] }}~
                </div>
                <t-space break-line size="10px" :key="collectionPath">
                    <t-check-tag
                    v-for="item in collectionPath"
                    :key="item.name"
                    @click="$router.push(item.path)"
                    size="large"
                    style="cursor: pointer;"
                    variant="outline"
                    >
                        <img :src="item.meta.avatar" height="20" style="margin-right: 5px;" >
                        {{ item.meta.title[i18n.language] }} ( {{ item.path }} )
                    </t-check-tag>
                </t-space>
            </t-card>
            <t-card :bordered="false" style="margin-top: 12px;">
                <template #title>
                    <t-icon name="shop"></t-icon>
                    <span style="vertical-align: middle; margin-left: 8px;">
                        {{ i18n.recommend[i18n.language] }}
                    </span>
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
                            v-for="goods in data.ranks[item.value]"
                            :key="goods.stylenumber"
                            @contextmenu.prevent.stop="createContextMenu($event, item)"
                            shadow
                            >
                                <t-image
                                class="next-good-item-image"
                                :src="goods['main-image'] == null ? '' : JSON.parse(goods['main-image'])[0]"
                                lazy
                                >
                                    <template #error>
                                        <img src="../../assets/loadfail.png" style="height: 70%; margin-bottom: 15%;">
                                    </template>
                                </t-image>
                                <div class="next-good-item-info">
                                    <div class="prev-good-item-info-name" style="font-size: 14px; line-height: 15px;">
                                        <t-tag
                                        size="small"
                                        theme="primary"
                                        variant="light"
                                        >
                                            {{ shop.storeOptions.filter(item => item.value === goods['store-id'])[0].label }}
                                        </t-tag>
                                        <t-tooltip :content="goods.name">
                                            {{ goods.name }}
                                        </t-tooltip>
                                    </div>
                                    <div style="margin: 10px 0;">
                                        <span class="number-show">
                                            {{ goods.salesCount }}
                                        </span>
                                        {{ i18n.piece[i18n.language] }}
                                        /
                                        <span class="number-show">
                                            {{ goods.salesAmount }}
                                        </span>
                                        {{ i18n.yuan[i18n.language] }}
                                    </div>
                                    <t-button
                                    v-if="goods['miaostreet-id'] != null"
                                    size="small"
                                    shape="round"
                                    @click.stop="miaostreetGoodsLink(goods)"
                                    >
                                        <template #icon>
                                            <t-icon name="browse"></t-icon>
                                        </template>
                                        {{ i18n.viewGoods[i18n.language] }}
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
import dayjs from 'dayjs'
import * as echarts from 'echarts'
import { translate, sort, miaostreetGoodsLink } from '../../hooks'

export default {
    setup(){
        const loading = ref(true)
        const percent = ref(0)
        const serve = inject('serve')
        const shop = inject('shop')
        const i18n = inject('i18n')

        const data = ref({
            famousWord: '',
            day: {},
            week: [],
            goods: [],
            supplier: [],
            ranks: {
                kcor: [],
                nt: [],
                '兔皇': [],
                dr: []
            },
            year: {}
        })
        const mainChart = ref(null)
        let charts = false

        const famousWord = async () => {
            return fetch(serve + "/famous-word")
            .then((response) => {
                return Promise.resolve(response.json())
            })
            .catch(() => {
                MessagePlugin.error(i18n.httpFail[i18n.language])
            })
        }
        const daySales = async () => {
            return fetch(serve + '/analysis/sum?store-id=' + shop.store + '&brand=' + shop.brand + '&mode=日&time=' + dayjs().subtract(1, 'day').format('YYYY-MM-DD'))
            .then(res => {
                return Promise.resolve(res.json())
            })
            .catch(() => {
                MessagePlugin.error(i18n.httpFail[i18n.language])
            })
        }
        const annualOverview = async () => {
            return fetch(serve + '/analysis/annual-overview?store-id=' + shop.store + '&brand=' + shop.brand)
            .then(res => {
                return Promise.resolve(res.json())
            })
            .catch(() => {
                MessagePlugin.error(i18n.httpFail[i18n.language])
            })
        }
        const goodsRanks = async () => {
            return fetch(serve + '/goods/mirros')
            .then(res => {
                return Promise.resolve(res.json())
            })
            .catch(() => {
                MessagePlugin.error(i18n.httpFail[i18n.language])
            })
        }

        const initF = async () => {
            let f = await famousWord()
            data.value.famousWord = f.hitokoto + ' 来自《' + f.works + '》'
            if(f.author && f.author != undefined && f.author != null){
                data.value.famousWord += f.author
            }
            data.value.famousWord += '。'
            translate(data.value.famousWord, i18n.language)
            .then(res => {
                data.value.famousWord = res.trans_result[0].dst

                return Promise.resolve()
            })
        }
        const initData = async () => {
            loading.value = true

            await initF()
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

            let ranks = await goodsRanks()
            data.value.ranks = {
                KCOR: [],
                NT: [],
                '兔皇': [],
                DR: []
            }
            for (let i = 0; i < ranks.length; i++) {
                data.value.ranks[ranks[i].brand].push(ranks[i])
            }
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
                    data: [i18n.salesAmount[i18n.language], i18n.refundsAmount[i18n.language], i18n.income[i18n.language]]
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
                        name: i18n.salesAmount[i18n.language],
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
                        name: i18n.refundsAmount[i18n.language],
                        data: [],
                        showSymbol: false,
                        smooth: true
                    },
                    {
                        type: 'line',
                        name: i18n.income[i18n.language],
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
        const historyStructure = {
            menus: [],
            goods: []
        }
        const history = ref({})
        const collectionPath = ref([])
        const clearHistory = () => {
            for (const key in history.value) {
                history.value[key] = []
            }
            localStorage.removeItem('history')
        }

        onMounted(() => {
            initData()

            setInterval(() => {
                history.value = JSON.parse(localStorage.getItem('history')) || historyStructure
                collectionPath.value = JSON.parse(localStorage.getItem('collection')) || []
            }, 500)
        })
        onActivated(() => {
            if(charts){
                charts.resize()
            }
        })
        watch(() => shop.store, () => {
            initData()
        })
        watch(() => shop.brand, () => {
            initData()
        })
        watch(() => i18n.language, () => {
            initF()
        })

        return{
            dayjs,
            percent,
            loading,
            shop,
            data,
            i18n,
            mainChart,
            sort,
            sortValue,
            history,
            collectionPath,
            miaostreetGoodsLink,
            clearHistory
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