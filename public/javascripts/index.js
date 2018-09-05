//Login validation
function login()
{
    
    var email = $('input[name=email]').val().trim();
    var pass   =    $('input[name=password]').val().trim();
    var message_error = $('.message-error');
    var url = 'login';
    window.localStorage;

    message_error.hide();

    if(pass == '' || email == '')
    {
        message_error.html('Fill all fields!').show();
    }else if(validateEmail(email) == false)
    {
        message_error.html('Email validation failed!').show();
    }else{
    
        $.post(url,
        {
            email: email,
            password: pass
        },
        function(data, status){

    
            if(data.status)
            {
                   

                    if(redirected)
                    {
                    var url = 'islogined';
                    var token = data.token;
                    localStorage.setItem("token", token);

                    $.post(url,
                    {
                        token: localStorage.getItem('token')
                    },function(data, status){
                        if(data.auth == false)
                        {
                            message_error.html('Error!: '+data.message).show();
                            window.location = '/';
                        }else{
                            var redirected = window.location = 'dashboard';
                        }
                    });
                }
                
            }else{

                message_error.html('Error!: '+(data.message!=undefined)?data.message:'Email or Password not matching!').show();
            }
            
           
        });
    }
}

//regiter validation
function newRegister()
{
    
    var email = $('input[name=email]').val().trim();
    var pass   =    $('input[name=password]').val().trim();
    var company_name   =    $('input[name=company]').val();
    var user_name   =    $('input[name=name]').val();
    var mobile   =    $('input[name=mobile]').val();
    var message_error = $('.message-error');
    var message_success = $('.message-success');
    var url = 'register/add';
    message_error.hide();
    message_success.hide();

    if(user_name == '' || company_name == '' || mobile == '' || email == '' || pass == '')
    {
        message_error.html('Fill all fields!').show();
    }else if(mobileValidation(mobile) == false)
    {
        message_error.html('Mobile validation failed!').show();
    }else if(validateEmail(email) == false)
    {
        message_error.html('Email validation failed!').show();
    }else if(pass.length < 5)
    {
        message_error.html('Password minimum (5) character validation failed!').show();
    }else{
    
        $.post(url,
        {
            name:user_name,
            company:company_name,
            mobile:mobile,
            email: email,
            password: pass
        },
        function(data, status){

            if(data.status == true)
            {
                $('.login-input').val('');
                message_success.html(data.message).show();
                message_error.hide();
            }else{
                 
                if(data.message == undefined)
                {
                    var message = '';
                    $.each(data, function(i, item) {
                        message+=item.param+": "+item.msg+"\n";
                    });
                    message_error.html('Error!: '+message).show();
                    message_success.hide();
                }else{
                    message_error.html('Error!: '+data.message).show();
                    message_success.hide();
                }
            }
           
        });
    }
}

/*
*Email Validation funtion
*Input: Email
*Return: true/false
*/
function validateEmail(emailField){

    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailField))
    {
      return (true)
    }

      return (false)

}

/*
*Email Validation funtion
*Input: Mobile
*Return: true/false
*/
function mobileValidation(mobNumber)
{
    if(parseInt(mobNumber) != mobNumber || mobNumber.length < 10 || mobNumber.length > 12) 
    {
      return false;
    }
    
    return true;
}

/*
*Auth Validation
*/
function authValidation()
{
    window.localStorage;
    var url = 'islogined';

    $.post(url,
    {
        token: localStorage.getItem('token')
    },function(data, status){ console.log(data);
        if(data.auth)
        { 
            message_error.html('Error!: '+data.message).show();
            window.location = '/';
        }
    }).fail(function() {
        window.location = '/';
      });
}

//load checking
$(document).ready(function(){
    var href    =   window.location.href;//split('/')
    if(href.includes("dashboard"))
    {
        authValidation();
    }
});
