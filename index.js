window.addEventListener("DOMContentLoaded", (event) => {
  const formIpInput = document.querySelector(".form-ip-input");
  const dataIpAddress = document.querySelector("[data-ip-address]");
  const dataIpAddressOutput = document.querySelector(
    "[data-ip-address-output]"
  );
  const dataIpGeoLocation = document.querySelector("[data-ip-geo-location]");
  const dataTimezoneOutput = document.querySelector("[data-timezone-output]");
  const dataIspOutput = document.querySelector("[data-isp-output]");

  //   formIpInput.addEventListener("submit", (event) => {
  //     event.preventDefault();
  //     dataIpAddress.value = "";
  //     console.log("ip submitted", dataIpAddress.value);
  //     if (ValidateIPaddress(dataIpAddress.value)) {
  //       return;
  //     }
  //     getIPData(dataIpAddress.value);
  //   });
  //   function ValidateIPaddress(ipaddress) {
  //     if (
  //       /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
  //         ipaddress
  //       )
  //     ) {
  //       return true;
  //     }
  //     alert("You have entered an invalid IP address!");
  //     return false;
  //   }
  //   let currentIP = undefined;
  function initializeMap() {
    var map = L.map("map").setView([51.505, -0.09], 13);
    L.tileLayer(
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1,
        accessToken:
          "pk.eyJ1Ijoia2V2ZXRpaDg2MSIsImEiOiJja2h4MzFxaG8wOW5pMzBsdGZ1NXFoeHh5In0.hw5mLyF4KWalDgcxAWrmuw",
      }
    ).addTo(map);
    map.zoomControl.setPosition("bottomright");

    formIpInput.addEventListener("submit", (event) => {
      event.preventDefault();
      console.log("ip submitted", dataIpAddress.value);
      if (!ValidateIPaddress(dataIpAddress.value)) {
        console.log("why is the function coming here");
        return;
      }
      getIPData(dataIpAddress.value);
      dataIpAddress.value = "";
    });
    function ValidateIPaddress(ipaddress) {
      if (
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
          ipaddress
        )
      ) {
        console.log("the ip should be real");
        return true;
      }
      alert("You have entered an invalid IP address!");
      return false;
    }

    async function getIPData(currentIP) {
      const ipStr = currentIP === undefined ? "" : "&ipAddress=" + currentIP;
      console.log(
        "currently making the request",
        `https://geo.ipify.org/api/v1?apiKey=at_KyLi7giZvLr02pMRn37b3KBLYA6E7${ipStr}`
      );
      const data = await fetch(
        `https://geo.ipify.org/api/v1?apiKey=at_KyLi7giZvLr02pMRn37b3KBLYA6E7${ipStr}`
      ).then((response) => response.json());
      console.log(data);

      let {
        ip,
        location: { city = "unknown", lat, lng, region, timezone },
        isp,
      } = data;
      console.log(city, ip, lat, lng, region, timezone, isp);
      if (city === "") {
        city = "unknown";
      }
      dataIpAddressOutput.textContent = ip;
      dataIpGeoLocation.textContent = city;
      dataTimezoneOutput.textContent = `UTC${timezone}`;
      dataIspOutput.textContent = isp;

      map.flyTo(L.latLng(lat, lng));

      const marker = L.marker(L.latLng(lat, lng)).addTo(map);
      const popUpMsg =
        currentIP === undefined ? "Your IP location" : "Ip location";
      marker
        .bindPopup(
          `<p style="margin:0">${popUpMsg}</p><h3 style="text-align:center">${city}.</h3>`
        )
        .openPopup();
    }

    getIPData();
  }

  // const requestOptions = {
  //   method: "GET",
  //   redirect: "follow",
  // };

  initializeMap();
  //   updateView();
});
