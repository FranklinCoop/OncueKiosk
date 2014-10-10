var g_iCount = 0;
var g_iAction = 0;
var g_DEFAULT = "default.htm";
var g_ERROR = "error.htm";
var g_UPC = "";
var s_Error = "Network error, reconnecting in...";
var s_Wait = "Please wait, connecting to network...";

function fnCountdown()
{
    nCountdown.innerText = g_iCount;
    g_iCount = g_iCount - 1;

    if (g_iCount < 0)
    {
        switch (g_iAction)
        {
        case 1:
            location.assign(g_DEFAULT);
            break;
        default:            
            location.assign(g_ERROR);
        }
    }

    setTimeout("fnCountdown()", 1000);
}

function fnReload()
{
    g_iAction = 0;
    g_iCount = 5;
    fnCountdown();
}

function fnBack()
{
    g_iAction = 1;
    g_iCount = 5;
    g_URL = location.href;
    fnCountdown();
}


function keyDown(frmName, frmInput)
{
    this.formobj=document.forms[frmName];

    if (this.formobj)
    {
        var key = window.event.keyCode;

        if( (key == 0x0D) || (key == 0x0A))
        {
            this.formobj.frmInput.value = g_UPC;
            g_UPC = "";
            this.formobj.submit();
        }
        else if( key > 0x2F && key < 0x3A )
        {
            g_UPC = g_UPC + String.fromCharCode(key);
        }
    }
}
