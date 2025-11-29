import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    AreaChart,
    Area
} from 'recharts';
import { TrendingUp, Users, ShoppingCart, RefreshCcw, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const SellerAnalytics = () => {
    // Mock Data for Sales Overview
    const salesData = [
        { name: 'Jan', sales: 4000, profit: 2400 },
        { name: 'Feb', sales: 3000, profit: 1398 },
        { name: 'Mar', sales: 2000, profit: 9800 },
        { name: 'Apr', sales: 2780, profit: 3908 },
        { name: 'May', sales: 1890, profit: 4800 },
        { name: 'Jun', sales: 2390, profit: 3800 },
        { name: 'Jul', sales: 3490, profit: 4300 },
    ];

    // Mock Data for Category Distribution
    const categoryData = [
        { name: 'Electronics', value: 400 },
        { name: 'Fashion', value: 300 },
        { name: 'Home', value: 300 },
        { name: 'Books', value: 200 },
    ];

    // Mock Data for Traffic Sources
    const trafficData = [
        { name: 'Organic Search', value: 45 },
        { name: 'Social Media', value: 25 },
        { name: 'Direct', value: 20 },
        { name: 'Paid Ads', value: 10 },
    ];

    // Mock Data for Demographics
    const demographicsData = [
        { name: '18-24', value: 15 },
        { name: '25-34', value: 45 },
        { name: '35-44', value: 25 },
        { name: '45+', value: 15 },
    ];

    // Mock Data for Top Products
    const topProductsData = [
        { name: 'Wireless Earbuds', sales: 120 },
        { name: 'Smart Watch', sales: 98 },
        { name: 'Running Shoes', sales: 86 },
        { name: 'Leather Wallet', sales: 75 },
        { name: 'Sunglasses', sales: 65 },
    ];

    // Mock Data for Order Status
    const orderStatusData = [
        { name: 'Delivered', value: 65 },
        { name: 'Shipped', value: 20 },
        { name: 'Pending', value: 10 },
        { name: 'Returned', value: 5 },
    ];

    const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];
    const TRAFFIC_COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#6366F1'];
    const STATUS_COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

    const kpiData = [
        {
            title: 'Conversion Rate',
            value: '3.2%',
            change: '+0.4%',
            trend: 'up',
            icon: TrendingUp,
            color: 'text-green-600',
            bgColor: 'bg-green-100'
        },
        {
            title: 'Avg. Order Value',
            value: '$125.00',
            change: '+$12.50',
            trend: 'up',
            icon: ShoppingCart,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
        },
        {
            title: 'Return Rate',
            value: '2.1%',
            change: '-0.5%',
            trend: 'down', // Good for return rate
            icon: RefreshCcw,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-100'
        },
        {
            title: 'Customer Retention',
            value: '45%',
            change: '+2.3%',
            trend: 'up',
            icon: Users,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100'
        }
    ];

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {kpiData.map((kpi, index) => {
                    const Icon = kpi.icon;
                    return (
                        <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className={`flex-shrink-0 rounded-md p-3 ${kpi.bgColor}`}>
                                        <Icon className={`h-6 w-6 ${kpi.color}`} />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500">{kpi.title}</dt>
                                            <dd className="flex items-baseline">
                                                <div className="text-2xl font-semibold text-gray-900">{kpi.value}</div>
                                                <div className={`ml-2 flex items-baseline text-sm font-semibold ${(kpi.trend === 'up' && kpi.title !== 'Return Rate') || (kpi.trend === 'down' && kpi.title === 'Return Rate')
                                                    ? 'text-green-600'
                                                    : 'text-red-600'
                                                    }`}>
                                                    {kpi.trend === 'up' ? <ArrowUpRight className="self-center flex-shrink-0 h-4 w-4" /> : <ArrowDownRight className="self-center flex-shrink-0 h-4 w-4" />}
                                                    <span className="sr-only">{kpi.trend === 'up' ? 'Increased' : 'Decreased'} by</span>
                                                    {kpi.change}
                                                </div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Sales & Traffic Overview */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue & Profit Overview</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={salesData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Legend />
                            <Area yAxisId="left" type="monotone" dataKey="sales" stroke="#4F46E5" fillOpacity={1} fill="url(#colorSales)" name="Revenue ($)" />
                            <Area yAxisId="right" type="monotone" dataKey="profit" stroke="#10B981" fillOpacity={1} fill="url(#colorProfit)" name="Profit ($)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Category Distribution */}
                <div className="bg-white p-6 rounded-lg shadow lg:col-span-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Sales by Category</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Traffic Sources */}
                <div className="bg-white p-6 rounded-lg shadow lg:col-span-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Traffic Sources</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={trafficData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {trafficData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={TRAFFIC_COLORS[index % TRAFFIC_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Customer Demographics */}
                <div className="bg-white p-6 rounded-lg shadow lg:col-span-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Age</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={demographicsData}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="value" fill="#6366F1" radius={[4, 4, 0, 0]} name="Percentage (%)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Selling Products */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Top Selling Products</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={topProductsData}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="sales" fill="#8B5CF6" radius={[0, 4, 4, 0]} name="Units Sold" barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Order Status Distribution */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Order Status Distribution</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={orderStatusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {orderStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerAnalytics;
