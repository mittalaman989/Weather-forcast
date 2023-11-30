const locationBtn = document.querySelector(".allow-my-location")
const loadingElem = document.querySelector(".loading")
const gpsMsg = document.querySelector(".gps-msg")
const geolocationReq = () => {
    getPosition()
        .then(res => {
            const { latitude: latt, longitude: longt } = res
            return fetch(`https://us1.locationiq.com/v1/reverse.php?key=pk.5717d3458249d3af26201b6e2442aa88&lat=${latt}&lon=${longt}&format=json&accept-language=en`)
        })
        .then(res => res.json())
        .then(data => {
           
            if (data.error) throw new Error("please try again later")

            
            const user_info = {
                country: data.address.country,
                city: data.address.town,
                latitude: data.lat,
                longitude: data.lon,
            }

          
            saveInLocalStorage(user_info)

           
            location.replace(`index.html`)
        })
        .catch(err => {
            
            loading(false)

            renderErr(`${err.message} <br> couldn't get access`)
        })
}

const loading = (bool) => {
    bool ? loadingElem.classList.add("active") : loadingElem.classList.remove("active")
}

const renderErr = (err) => {
    gpsMsg.classList.add("gps-msg-err")
    gpsMsg.innerHTML = err
}


const getPosition = () => {
    return new Promise((res, rej) => {
       
        navigator.geolocation.getCurrentPosition(
            
            position => {
                res(position.coords)
            },
            
            err => {
                rej(new Error("problem getting your geolocation of city"))
            }
        )
    })
}

const saveInLocalStorage = (object) => localStorage.setItem("Geolocation", JSON.stringify(object))


locationBtn.addEventListener("click", () => {
  
    loading(true)
  
    geolocationReq()
})

window.addEventListener("load", () => localStorage.clear())
