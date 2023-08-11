//a function that takes in a number of factors and assesses users maintenence calories
const maintenenceCalories = (bodyFatPercentage,weight,gender,activityLevel,age) => {
//formula for assessing BASAL METABOLIC RATE
// BMR (BASAL METABOLIC RATE) = (13.587 X LBM) + (9.613 X FM) + (198 X GENDER) – (3.351 X AGE) + 674 
const fatMass=weight*(bodyFatPercentage/100);
const leanMass=weight-fatMass;

if(gender=='Male')
{
    g_multiplier=1
}
else
{
    g_multiplier=0;
}
const bmr=(13.587*leanMass)+(9.613 * fatMass)+(198*g_multiplier)-(3.351*age)+674;
var activity_multiplier=0;
if(activityLevel==="Sedentary")
{
    activity_multiplier=1.2;
}
else if(activityLevel==="Light Activity")
{
    activity_multiplier=1.375;
}
else if(activityLevel==="Moderate Activity")
{
    activity_multiplier=1.55;
}
else if(activityLevel==="Highly Active")
{
    activity_multiplier=1.725;
}
console.log(bmr+""+activity_multiplier)
const maintenenceCalories=bmr*activity_multiplier;
return maintenenceCalories;

}

module.exports=maintenenceCalories