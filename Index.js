const puppeteer = require('puppeteer-core');
const axios = require('axios');
const 2Captcha = require('2captcha');

const ANILIST_TOKEN = '';
const TWO_CAPTCHA_API_KEY = '';

(async () => {
  try {
    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: false,
    });
    const page = await browser.newPage();
    await page.goto('https://anilist.co/login');

    await page.waitForSelector('input[name="email"]');
    await page.type('input[name="email"]', '');
    await page.type('input[name="password"]', '');

    // Envia a imagem de captcha para o 2Captcha para ser resolvida
    const captchaImg = await page.$('form img');
    const captchaImgSrc = await captchaImg.getProperty('src');
    const captchaText = await resolveCaptcha(captchaImgSrc);

    // Preenche o campo de captcha e clica no botão de submit
    await page.type('input[name="captcha"]', captchaText);
    await page.click('button[type="submit"]');

    // Aguarda o carregamento da página do perfil do usuário
    await page.waitForSelector('#header-menu-user');
    console.log('Login realizado com sucesso!');

    // Utiliza o token de acesso para fazer uma
    const request = require('request-promise');
    const access_token = '';

    const options = {
        method: 'GET',
        uri: 'https://anilist.co/api/auth/verify',
        headers: {
            'Authorization': `Bearer ${access_token}`
        },
        json: true
    };
    
    const response = await request(options);
    console.log(response);

    async function getAccessToken() {
        let access_token;
        try {
          const response = await axios.post('https://anilist.co/api/auth/access_token', {
            grant_type: '',
            client_id: '',
            client_secret: ANILIST_TOKEN,
            2captcha_key: TWO_CAPTCHA_API_KEY
          });
          access_token = response.data.access_token;
        } catch (err) {
          console.log(err);
        }
        return access_token;
      }
      
      const access_token = await getAccessToken();

      // Agora você pode usar o access_token para
      const access_token = JSON.parse(response).access_token;
      console.log(`Access token: ${access_token}`);
  
      // Agora você pode usar o access_token para realizar chamadas à API do Anilist.
      // Por exemplo, para obter informações do usuário:
      const userData = await axios.get('https://anilist.co/api/user', {
          headers: {
              'Authorization': `Bearer ${access_token}`
          }
      });
      console.log(userData.data);
  
      await browser.close();
    } catch (err) {
      console.log(err);
    }
  })();