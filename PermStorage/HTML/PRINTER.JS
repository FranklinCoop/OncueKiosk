<!--
// Printer command and formatting constants
PRN_PORT = "LPT1:";
PRN_INIT = '\x1b' + 'd' + '\0';
//PRN_INIT = '\x1b' + '\x40';
PRN_CUT_FULL = '\x1b' + 'i';
PRN_CUT_PART = '\x1b' + 'm';
PRN_BOLD_ON = '\x1d' + 'D' + '\xDF';
PRN_BOLD_OFF = '\x1d' + 'D' + '\x80';
PRN_ALIGN_LEFT = '\x1b' + 'C' + '\x02';
PRN_FONT_12x20 = '\x1b' + '%' + '\x01';
PRN_HRI_BELOW = '\x1d' + 'H' + '\x02';
PRN_UPCA = '\x1d' + 'k' + '\0';
PRN_BARCODE = PRN_HRI_BELOW + PRN_UPCA;
PRN_CUT = PRN_CUT_FULL;
CrLf = '\x0d' + '\x0a';

// Global vars
var strItem = "";
var strDesc = "";
var strExpire = "";
var strUPC = "";

function PrintAbout()
{
	PrnAPS.AboutBox();
}

function GetItem(Index)
{
	switch (Index)
	{
	case 1:
		strItem = "Preserve";
		strDesc = "$1.00 Off any Two Preserve" + CrLf + "Toothbrushes or Razor Items";
		strExpire = "06/30/2012";
		strUPC = "021000100101";
		break;
	case 2:
		strItem = "New England Coffee";
		strDesc = "Save $1.50 Off any bag of" + CrLf + "New England Coffee";
		strExpire = "04/30/2012";
		strUPC = "021000100200";
		break;
	case 3:
		strItem = "PJs Organics";
		strDesc = "$1.00 Off any 1 purchase of" + CrLf + "PJs Organics burritos or meals";
		strExpire = "03/28/2012";
		strUPC = "021000100309";
		break;
	case 4:
		strItem = "Fresh Step Scoop";
		strDescs = "Save $1.00 on Fresh Scoop" + CrLf + "Scoopable litter, 20lb or larger";
		strExpire = "04/30/2012";
		strUPC = "021000100408";
		break;
	}
}

function PrintItem(Index)
{
	var s;
	var dToday = new Date();
	var dExpire = new Date();

	PrnAPS.Open();

	if (!PrnAPS.Connected())
	{
		alert("Error!");
		return;
	}

	// Initialize the printer
	s = PRN_INIT;

	//set alignment to left
	s = s + PRN_ALIGN_LEFT;

	//set font to 12x20
	s = s + PRN_FONT_12x20;

	//get item details
	GetItem(Index);
	dExpire.setDate(dExpire.getDate() + 14);
	dExpire.setHours(0, 0, 0, 0);
	strExpire = "Expiration Date: " + dExpire.toDateString();

	s = s + strItem + CrLf + CrLf;
	s = s + strDesc + CrLf + CrLf;
	s = s + strExpire + CrLf + CrLf;

	// Write out the bar code
	s = s + PRN_BARCODE + strUPC + '\0' + CrLf;

	// Write out the footer and paper cut command
	s = s + dToday.toDateString() + ' ' + dToday.toTimeString() + CrLf + CrLf; 
	s = s + CrLf + CrLf + CrLf + CrLf + CrLf + CrLf;
	s = s + PRN_CUT;

	PrnAPS.Send(s, s.length);
	PrnAPS.Close();
}

function PrintTest()
{
	var s;
	var d = new Date();

	//alert("PrintTest()...");
	PrnAPS.Open();

	if (!PrnAPS.Connected())
	{
		//alert("Error!");
		return;
	}

	//alert("...PrintInit...");
	// Initialize the printer
	s = PRN_INIT;

	//set alignment to left
	s = s + PRN_ALIGN_LEFT;

	//set font to 12x20
	s = s + PRN_FONT_12x20;
	PrnAPS.Send(s, s.length);

	// Write out the product description
	strDesc = "Fred Product Description";
	s = strDesc + CrLf;
	PrnAPS.Send(s, s.length);

	// Write out the bar code
	//s = PRN_BARCODE + strUPC + '\0' + CrLf;
	//PrnAPS.Send(s, s.length);

	// Write out the price
	strPrice = "$1.09"
	s = strPrice + CrLf;
	PrnAPS.Send(s, s.length);

	// Write out the footer and paper cut command
	s = d.toDateString() + ' ' + d.toTimeString() + CrLf + CrLf; 
	s = s + CrLf + CrLf + CrLf + CrLf;
	s = s + PRN_CUT;
	PrnAPS.Send(s, s.length);
	PrnAPS.Close();
	//alert("PrintTest() success!");
}

function PrintCheckout()
{
	var s;

	//alert("PrintCoupon()...");
	PrnAPS.Open();

	if (!PrnAPS.Connected())
	{
	  return;
	}

	//initialize printer
	s = '\x1b' + '@' + '\0';

	//set linefeed spacing to 26 dots
	s = s + '\x1b' + '3' + '\x1a';

	//set barcode default height (50 pixels)
	s = s + '\x1d' + 'h' + '\x32';

	//set barcode default width ratio 2.0
	s = s + '\x1d' + '\x77' + '\x02';

	//set barcode text display (off)
	s = s + '\x1d' + 'H' + '\0';
	//PrnAPS.Send(s, s.length);

	//execute receipt print...
	s = s + "PrintCoupon()" + CrLf;

	//set alignment to center
	s = s + '\x1b' + 'a' + '\x01';

	//set barcode symbology CODE128
	s = s + '\x1d' + 'k' + '\x07';

	//set Code128 Start_B
	s = s + '\x7b' + 'B';

	//barcode data + NUL
	s = s + "30004052770008" + '\0';

	//set alignment to left
	s = s + '\x1b' + 'a' + '\0';

	//barcode text
	s = s + "             30004052770008" + CrLf + CrLf;
	//PrnAPS.Send(s, s.length);

	//receipt header
	s = s + "      THANK YOU FOR SHOPPING AT" + CrLf;
	s = s + "           OnCue, InfoCue Kiosk" + CrLf + CrLf;
	s = s + "TERMINAL 990 CUSTOMER COPY    PURCHASE" + CrLf;
	s = s + "S096 ASSC 111111 TR0056 1/10/2012  223P" + CrLf + CrLf;
	//PrnAPS.Send(s, s.length);

	//receipt body
	s = s + "SHAMPOO/CONDITIONER  2 @ 4.69   9.38" + CrLf;
	s = s + "LORD OF RINGS/TWOTOW 1 @ 9.99   9.99" + CrLf;
	s = s + "4X6 PHOTO PRINTS     6 @ 0.29   1.74" + CrLf;
	s = s + CrLf + CrLf;

	//receipt subtotal
	s = s + "TOTAL                          21.11" + CrLf;

	//receipt total <bold on><data><bold off>
	s = s + '\x1b' + 'E' + '\x01';
	s = s + "TOTAL AMOUNT DUE STORE         21.11" + CrLf + CrLf;
	s = s + '\x1b' + 'E' + '\0';
	//PrnAPS.Send(s, s.length);

	//receipt tender
	s = s + "AMERICAN EXPRESS     XXXXXXXXXXX2000 M" + CrLf;
	s = s + "8888 APPROVED CONTROLLER" + CrLf;
	s = s + "EXPIRATION DATE 12/2014" + CrLf;
	s = s + "   AMERICAN EXPRESS            21.11" + CrLf + CrLf;
	//PrnAPS.Send(s, s.length);

	//set alignment to center
	s = s + '\x1b' + 'a' + '\x01';

	//set barcode symbology CODE128
	s = s + '\x1d' + 'k' + '\x07';

	//set Code128 Start_B
	s = s + '\x7b' + 'B';

	//barcode data + NUL
	s = s + "0969900056" + '\0';

	//set alignment to left
	s = s + '\x1b' + 'a' + '\0';

	//barcode text
	s = s + "               0969900056" + CrLf + CrLf;
	//PrnAPS.Send(s, s.length);

	//receipt footer
	//receipt total <bold/dbl width on><data><bold/dbl width off>
	s = s + '\x1b' + '!' + '\x28';
	s = s + "KEEP THIS RECEIPT" + CrLf + CrLf;
	s = s + '\x1b' + '!' + '\0';
	s = s + '\x1b' + '!' + '\x28';
	s = s + "FOR RETURN/EXCHANGE" + CrLf + CrLf;
	s = s + '\x1b' + '!' + '\0';
	//PrnAPS.Send(s, s.length);

	s = s + "           See Reverse Side" + CrLf + CrLf;

	s = s + "   Outstanding Service is our goal." + CrLf;
	s = s + "Please tell OnCue how our service was" + CrLf;
	s = s + "    today at www.oncuegroup.com" + CrLf + CrLf;

	s = s + "Sales Associate: Otto Matic" + CrLf;

	//print buffer with 6 linefeeds, do paper cut, x linefeeds after cut
	s = s + '\x1b' + '\x64' + '\x06' + '\x1b' + 'i' + '\x1b' + '\x64' + '\x04';
	PrnAPS.Send(s, s.length);
	PrnAPS.Close();
}
-->
