const Pool = require('pg').Pool;
const th = new Pool({
    user: 'postgres',
    host: '119.59.125.134',
    database: 'th',
    password: 'Pgis@rti2dss@2020',
    port: 5432,
});

const cv = new Pool({
    user: 'postgres',
    host: '119.59.125.134',
    database: 'green',
    password: 'Pgis@rti2dss@2020',
    port: 5432,
});

exports.th = th;
exports.cv = cv;
