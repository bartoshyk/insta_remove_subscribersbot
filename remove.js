// connect dependencies
var setting = require ('./setting.json');
var webdriver = require('selenium-webdriver');
 by = webdriver.By;
 Promise = require('promise');
 var log4js = require('log4js'); 

// connect logs
 log4js.loadAppender('file');
 log4js.addAppender(log4js.appenders.file('bot.log'), 'instabot');
 var logger = log4js.getLogger('instabot');
 logger.setLevel('DEBUG');

//  connect webdriver
 var browser = new webdriver
 .Builder()
 .withCapabilities(webdriver.Capabilities.firefox())
 .build();
 
 browser.manage().window().setSize(1024, 700);
 
 // delay
 var randomInteger = function randomInteger(min, max) {
     var rand = min - 0.5 + Math.random() * (max - min + 1)
     rand = Math.round(rand);
     return rand;
 }



 var xpathLoginButton = '//*[@id="react-root"]/section/main/div/article/div/div[1]/div/form/div[4]/button';
 var xpathUserMenu = '//*[@id="react-root"]/section/main/div/header/section/div[1]/div/button/span';
 var xpathExit = '/html/body/div[3]/div/div/div/button[6]';
 var xpathFollowing = '//*[@id="react-root"]/section/main/div/header/section//*/button';
 var xpathNotFollowing = '/html/body/div[3]/div/div/div[3]/button[1]';
 var xpathFollowers = '//*[@id="react-root"]/section/main/div/header/section/ul/li[2]/a/span';

var followers =  setting.followers;
var following = setting.following;
var username = setting.botLogin;
var password = setting.botPass;


var notSubscribers = following.filter(e=> followers.indexOf(e) < 0);
logger.info('notSubscribers ' + notSubscribers);

signIn();
unsubscribe(notSubscribers);
signOut();

// authorization
function signIn() {
    browser.get('https://www.instagram.com/accounts/login/');
    browser.sleep(randomInteger(5000, 8000));
    browser.findElement(by.name('username')).sendKeys(username);
    browser.sleep(randomInteger(5000, 8000));
    browser.findElement(by.name('password')).sendKeys(password);
    browser.findElement(by.xpath(xpathLoginButton)).click();
    browser.sleep(randomInteger(20000, 30000))
    .then(it=>logger.info('Logged in ' + username + '!'));
}

// Unsubscribe
function unsubscribe(users) {
    users.forEach(user => {
        Promise.all([
            browser.get('https://www.instagram.com/' + user),
            browser.sleep(randomInteger(7000, 8000)),
            browser.findElement(by.xpath(xpathFollowing)).click(),
            browser.sleep(randomInteger(5000, 8000)),
            browser.findElement(by.xpath(xpathNotFollowing)).click(),
            browser.sleep(randomInteger(5000, 8000))  
        ])
        .then(() => logger.info('unsubscribe ' + user))
        .catch(error => logger.error('oops :( ' + user))
    })
};
// exit from the program
function signOut() {
    browser.get('https://www.instagram.com/' + username);
    browser.sleep(randomInteger(5000, 7000));
    browser.findElement(by.xpath(xpathUserMenu)).click();
    browser.sleep(randomInteger(5000, 8000));
    browser.findElement(by.xpath(xpathExit)).click();
    browser.sleep(randomInteger(5000, 8000))
    .then(it=>logger.info('Logged out ' + username + '!'));
}