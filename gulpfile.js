var config = {
    production: false,
    buildDir: './src/frontend/public/',
    mainStylDir: './src/frontend/app/stylus/',
    serverJsDir: './src/frontend/app/',
    appDir: '../src/frontend/app/',
    publicDir: './src/frontend/public/'
};

require('./tasks/common.js')(config);