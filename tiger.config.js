module.exports = {
    baseUrl: 'http://www2.census.gov/geo/tiger/GENZ2015/shp/',
    files: [{
        filename: 'cb_2015_us_state_20m',
        resolution: 'low'
    }, {
        filename: 'cb_2015_us_state_5m',
        resolution: 'med'
    }, {
        filename: 'cb_2015_us_state_500k',
        resolution: 'high'
    }]
};
