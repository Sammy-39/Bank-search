//to create spinner element
var spinnerElem = document.createElement("div")
spinnerElem.setAttribute("class","spinner-border spin my-4")
spinnerElem.setAttribute("style","width: 3rem; height: 3rem;")
spinnerElem.setAttribute("role","status")
spinnerElem.innerHTML = `<span class="sr-only">Loading...</span> `

//to add error message to the form element
function addErrMsg(msg){
    var errorMsgElement = document.createElement("p")
    errorMsgElement.setAttribute("class","my-2 px-1 err")
    errorMsgElement.innerText = msg
    formElement.append(errorMsgElement)
}

//to remove error message from the form element
function removeErrMsg(){
    var errMsgElem = document.querySelector(".err")
    if(errMsgElem){
        document.querySelector(".form").removeChild(document.querySelector(".err"))
    }
}

//to remove the previous search result content
function removePreviuosResult(){
    var contentElem = document.querySelector(".content")
    while(contentElem.firstChild){
        contentElem.removeChild(contentElem.firstChild)
    }

    contentElem.style.display = "none";
}

//to remove spinner element
function removeSpinner(){
    if(document.querySelector(".spin")){
        document.querySelector(".form").removeChild(document.querySelector(".spin"))
    }
}


//to get the input IFSC code
var formElement = document.querySelector(".form")
var ifscCode

formElement.addEventListener('submit',(event)=>{

    event.preventDefault()

    removePreviuosResult()

    document.querySelector(".form").append(spinnerElem)

    var inputElement = document.querySelector(".search-input")
    ifscCode = inputElement.value

    //to get the api response for bank details using IFSC Code
    async function getBankDetails(iCode){
        try{
            var bankDataResult = await fetch(`https://cors-anywhere.herokuapp.com/https://ifsc.razorpay.com/${iCode}`)
            var bankData = await bankDataResult.json()
            return bankData
        }
        catch(err){
            return err
        }
    }

    getBankDetails(ifscCode)
    .then((data)=>{

        removeSpinner()
        
        if(data === "Not Found") {
            addErrMsg("Enter valid IFSC Code")
        }
        else{
            console.log(data)

            var bankDetailsList = ["Bank Name", "IFSC Code", "Branch", 
            "Address", "Contact", "City", "RTGS", "District", "State"]

            var bankDataKeys = ["BANK", "IFSC", "BRANCH", "ADDRESS", 
            "CONTACT", "CITY", "RTGS", "DISTRICT", "STATE"]

            var bankDetailsListElem = []

            for(var i=0;i<9;i++){
                bankDetailsListElem.push(document.createElement("p"))
                bankDetailsListElem[i].innerHTML = `<span class="title">${bankDetailsList[i]}: </span> 
                ${data[bankDataKeys[i]]}`
            }

            var contentElem = document.querySelector(".content")
            contentElem.append(...bankDetailsListElem)
            contentElem.style.display = "block"

            removeErrMsg()
        }
    })
    .catch((err)=>{
        
        addErrMsg("Data not available")
    })
})

