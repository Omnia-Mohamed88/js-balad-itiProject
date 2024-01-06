const worldNewsKey = 'c191f84e43a54121a3c886de24fa7d2b';
let selectcountry = document.getElementById("select");
const serviceId = ('service_0amvman');
const templateId = ('template_uxmhdyr');
const alertMessage = document.getElementById("alertMessage");
let selectcountryvalue;
let infoSec = document.getElementById("info-section")
let factsSec = document.getElementById("facts-section")
let mapSec = document.getElementById("map-section")
let newsSec = document.getElementById("news-section")
let formSec = document.getElementById("form-section")




fetch("https://restcountries.com/v3.1/all?fields=name")
    .then(response => {
        return response.json();
    })
    .then(data => {
        data.forEach(element => {
            const countryName = element.name.common;
            selectcountry.innerHTML += `<option>${countryName}</option>`;
        });
    });

selectcountry.addEventListener("change", function () {
    selectcountryvalue = selectcountry.value;
    console.log("Selected Country:", selectcountryvalue);
    infoSec.hidden = false;
    factsSec.hidden = false;
    mapSec.hidden = false;
    newsSec.hidden = false;
    formSec.hidden = false;

    fetch(`https://restcountries.com/v3.1/name/${selectcountryvalue}?fullText=true`)
        .then(response => response.json())
        .then(country => {
            console.log(country);

            let flag = document.getElementById("flag");
            flag.src = country[0].flags.svg;

            let coatOfArmy = document.getElementById("coatOfArmy");
            coatOfArmy.src = country[0].coatOfArms.svg;

            let unCheckIcon = document.getElementById("unCheckIcon");
            let unCrossIcon = document.getElementById("unCrossIcon");

            if (country[0].unMember) {
                unCheckIcon.style.display = "inline";
                unCrossIcon.style.display = "none";
            } else {
                unCheckIcon.style.display = "none";
                unCrossIcon.style.display = "inline";
            }

            let independentCheck = document.getElementById("independetcheck");
            let independentCross = document.getElementById("independentcross");

            if (country[0].independent) {
                independentCheck.style.display = "inline";
                independentCross.style.display = "none";
            } else {
                independentCheck.style.display = "none";
                independentCross.style.display = "inline";
            }

            let population = document.getElementById("population");
            population.innerHTML = country[0].population.toLocaleString("en-Us");

            let continent = document.getElementById("continent");
            continent.innerHTML = country[0].region;

            let startofweek = document.getElementById("startOfWeek");
            startofweek.innerHTML = country[0].startOfWeek.toUpperCase();

            let timezone = document.getElementById("TimeZone");
            timezone.innerHTML = country[0].timezones[0];

            let capital = document.getElementById("Capital");
            capital.innerHTML = country[0].capital[0];

            let mapIframe = document.getElementById("map-iframe");
            mapIframe.src = `https://www.google.com/maps?q=${country[0].name.common}&hl=en&z=6&output=embed`;

            let mapExternalLink = document.getElementById("external-map-link");
            mapExternalLink.href = `https://www.google.com/maps?q=${country[0].name.common}&hl=en&z=6`;

            if (!mapIframe.src) {
                mapIframe.src = country[0].maps.openStreetMaps;
            }
            bindCountryNews(country[0].cca2);
        })
        .catch(error => {
            console.error("Error fetching country info:", error);
        });
});
function addNews(news) {
    let newsRow = document.getElementById("news-row");
    const newsDiv = document.createElement('div');
    newsDiv.classList.add('col-md-3', 'col-sm-6', 'news-box');
    newsDiv.innerHTML = `
      <div class="new-thumb"> <img src="" alt="">
      </div>
      <div class="new-txt">
        <ul class="news-meta">
          <li>${news.publish_date}</li>
        </ul>
        <h6><a href="${news.url}">${news.title}</a></h6>
        <p>${news.text.slice(0, 101)}...</p>
      </div>
      <div class="news-box-f"> <img
        src="https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png"
        alt="">${news.author}<a href="${news.url}"><i class="fas fa-arrow-right"></i></a>
      </div>`;

    newsRow.appendChild(newsDiv);
    let currentLastElement = newsDiv.querySelector(".new-thumb");
    currentLastElement.querySelector("img").src = news.image;
    currentLastElement.querySelector("img").onerror = function () {
        currentLastElement.querySelector("img").src = "./images/news.png";
    }
}

async function bindCountryNews(countryCode) {
    countryCode = countryCode.toLowerCase();
    try {
        let res = await fetch(`https://api.worldnewsapi.com/search-news?api-key=${worldNewsKey}&source-countries=${countryCode}`);
        let data = await res.json();

        console.log("API Response:", data);

        let news = data.news;

        let newsRow = document.getElementById("news-row");
        newsRow.innerHTML = ``;

        news.forEach((e) => {
            addNews(e);
        });

    } catch (error) {
        console.error("Error fetching country news:", error);
    }
}



// Initialize EmailJS
(function () {
    emailjs.init("98Fk7Sms3Ewaqkd6w");
})();

let contactForm = document.getElementById("contact-form");

contactForm.addEventListener("submit", (ev) => {
    ev.preventDefault();

    var params = {
        from_name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        message: document.getElementById("message").value,
    };

    // Send the email using EmailJS
    emailjs.send(serviceId, templateId, params)
        .then((res) => {
            // Clear form fields on successful submission
            document.getElementById("name").value = "";
            document.getElementById("email").value = "";
            document.getElementById("message").value = "";

            alertMessage.classList.replace("alert-danger", "alert-success");
            alertMessage.removeAttribute("hidden");
            alertMessage.innerHTML = `Your Message Sent Successfully.`;

            setTimeout(() => {
                alertMessage.setAttribute("hidden", "hidden");
            }, 4000);
        })
        .catch((err) => {
            alertMessage.classList.replace("alert-success", "alert-danger");
            alertMessage.removeAttribute("hidden");
            alertMessage.innerHTML = `Sorry, there is something wrong. Try again.`;

            setTimeout(() => {
                alertMessage.setAttribute("hidden", "hidden");
            }, 4000);
        })
        .finally(function () {
            ev.target.reset();
        });
});








