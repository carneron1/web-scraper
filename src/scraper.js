const axios = require('axios');
const cheerio = require('cheerio');
const { find } = require('domutils');


const scraper = ()=>{
    sc = {};

    sc.load = async ()=>{
        const baseUrl = 'https://flibs2021.prod1.sherpaserv.com';
        const listUrl = '/activ-portal/show-planner/exhibitors/'
        let mainContent = await axios(baseUrl+listUrl);
        let $ = cheerio.load(mainContent.data);
        let totalPagesContainer = $('.pagination ul > div').html();
        let totalPages = Number(totalPagesContainer.split('of ')[1]);
        console.log('Total pages to scrap: ',totalPages)
        let resultItems = [];
        for (let i = 1; i <= totalPages; i++){
            console.log('Scraping page: ', i);
            try{
                let content = await axios(baseUrl+listUrl+`?page=${i}`);
                $('.search-result-row').each(function (){
                    let title = $(this).find('.search-result-information-name').text();
                    let url = $(this).find('a').attr('href');
                    resultItems.push({
                        title,
                        url:`${baseUrl}${url}`
                    })
                });
            }catch(e){
            }
        }
        let data = [];
        for (let item of resultItems){
            let content = await axios(item.url);
            let $ = cheerio.load(content.data);
            let title = $('header h2').text();
            let website = '';
            let email = '';
            let phone = '';
            let address = '';
            $('.entity-information-row').each(function(){
                if ($(this).find('.entity-information-label').text()=='Website') website = $(this).find('.entity-information-value a').attr('href');
                if ($(this).find('.entity-information-label').text()=='Email') email = $(this).find('.entity-information-value a').text();
                if ($(this).find('.entity-information-label').text()=='Phone') phone = $(this).find('.entity-information-value').text();
                if ($(this).find('.entity-information-label').text()=='Address') address = $(this).find('.entity-information-value').text();
            })
            address = address.replace(/(\r\n|\n|\r|\t)/gm, "");
            title = title.replace(/(\r\n|\n|\r)/gm, "");
            let obj = {
                title,
                website,
                email,
                phone,
                address,
            }
            console.log(obj);
            data.push(obj);
        }
        console.log('Total details scraped: ', data.length);
    }
    return sc;
}


module.exports = scraper();