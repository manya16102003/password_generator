const inputslider=document.querySelector("[data-lengthslider]");
const lengthdisplay=document.querySelector("[data-length]");
const passworddisplay=document.querySelector("[data-passworddisplay]");
const copybtn=document.querySelector("[data-copy]");
const copymsg=document.querySelector("[data-copymsg]");
const uppercasecheck=document.querySelector("#uppercase");
const lowercasecheck=document.querySelector("#lowercase");
const numbercheck=document.querySelector("#numbers");
const symbolcheck=document.querySelector("#Symbols");
const indicator=document.querySelector("[data-indicator]");
const generatebtn=document.querySelector(".generatebutton");
const allcheckbox=document.querySelectorAll("input[type=checkbox]");

const symbols='~!@#$%^&*(){}[]<,>`?/'; 
let password=""
let passwordlength=10;//the initial value of slider is 10
let checkcount=0; //at start upeercase checkboxe is checked 

// set password length
handleslider();
function handleslider()
{
    inputslider.value=passwordlength;
    lengthdisplay.innerText=passwordlength;
    const min = inputslider.min;
    const max = inputslider.max;
    inputslider.style.backgroundSize = ( (passwordlength - min)*100/(max - min)) + "% 100%"
}

//strength of paassword (color)
setindicator('#ccc');
function setindicator(color)
{
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;

}

//geneting random number from range
function getrandinteger( min , max)
{
    return Math.floor(Math.random()*(max-min))+min;
}
function generaterandomnumber()
{
    return getrandinteger(0,9);
}
function generatelowercase()
{
    return String.fromCharCode(getrandinteger(97,123));
}
function generateuppercase()
{
    return String.fromCharCode(getrandinteger(65,91))
}
function generateSymbols()
{
    const randnum=getrandinteger(0, symbols.length);
    return symbols.charAt(random);  
}

//logic to determine strength of password
function calcstrength()
{
    let hasupper=false;
    let haslower=false;
    let hasnum=false;
    let hassyn=false;
    if(uppercasecheck.checked) hasupper=true;
    if(lowercasecheck.checked) haslower=true;
    if(numbercheck.checked) hasnum=true;
    if(symbolcheck.checked) hassyn=true;
    if(haslower && hasupper && (hassyn||hasnum) && passwordlength>=8)
        {
            setindicator("#0f0");
        }
    else if ((haslower || hasupper) && (hasnum || hassyn) && passwordlength>=6)
        {
            setindicator("#ff0");
        }
    else{
        setindicator("#f00");
    }
}

//copy content to clipboard
async function copycontent()
{
    try{
        await navigator.clipboard.writeText(passworddisplay.value);
        copymsg.innerText="copied";
    }
    catch(e)
    {
        copymsg.innerText("failed");
    }
    copymsg.classList.add("active");
    setTimeout( ()=>
    {
        copymsg.classList.remove("active");
    },2000);
}

//fisher yates method (shuffle password)
function shufflepassword(array)
{
    for(let i=array.length-1;i>0;i--)
        {
            //finding random number between 0 and last index
            const j=Math.floor(Math.random()*(i+1));
            //swap
            const temp=array[i];
            array[i]=array[j];
            array[j]=temp;
        }
        let str="";
        array.forEach((el)=>(str+=el));
        return str;
}

//mainting count of checkbox being checkand if passwordlength is less then checked checkbox then password length =checked checkbox
function handlecheckbox()
{
    checkcount=0;
    allcheckbox.forEach((checkbox)=>
    {
        if(checkbox.checked) checkcount++;
    });
    if(passwordlength<checkcount)
        {
            passwordlength=checkcount;
            handleslider();
        }
}
//if any change happens in checking the checkbox (checking or unchecking ) call handlecheck to update count
allcheckbox.forEach((checkbox)=>
{
    checkbox.addEventListener('change' , handlecheckbox);
})

//value should get change when slider is draged by calling handleslider
inputslider.addEventListener('input' , (e)=>
{
    passwordlength=e.target.value;
    handleslider();
})

//when clicked on copybtn then password should be copied to clipboard by calling copycontent function
copybtn.addEventListener('click',()=>
{
    if(passworddisplay.value)
        copycontent();
})

//gebrating password after clicking on generate buttton
generatebtn.addEventListener('click',()=>
{
    if(checkcount<=0) return;
    if(passwordlength<=checkcount)
        {
            passwordlength=checkcount;
            handleslider();
        }
        //remove old password
        password="";
        // if(uppercasecheck.checked)
        //     {
        //         password+=generateuppercase();
        //     }
        // if(lowercasecheck.checked)
        //     {
        //         password+=generatelowercase();
        //     }
        // if(numbercheck.checked)
        //     {
        //         password+=generaterandomnumber();
        //     }
        // if(symbolcheck.checked)
        //     {
        //         password+=generateSymbols();
        //     }
         let funcArr=[];
         if(uppercasecheck.checked)
            funcArr.push(generateuppercase);
        if(lowercasecheck.checked)
            funcArr.push(generatelowercase);
        if(symbolcheck.checked)
            funcArr.push(generateSymbols);
        if(numbercheck.checked)
            funcArr.push(generaterandomnumber);

        //first including charated that being checked 
        for(let i=0;i<funcArr.length;i++)
            {
                password+=funcArr[i]();
            }

        //then include remaining charaters
        for(let i=0;i<passwordlength-funcArr.length;i++)
            {
                let randindex=getrandinteger(0,funcArr.length);
                password+=funcArr[randindex]();
            }

         //shuffle the password
        password=shufflepassword(Array.from(password));
        passworddisplay.value=password;
        calcstrength();

})