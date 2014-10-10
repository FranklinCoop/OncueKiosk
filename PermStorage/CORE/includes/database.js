function getQuerystring(key, default_)
{
	if (default_==null) default_=""; 
	key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");
	var qs = regex.exec(window.location.href);
	if(qs == null)
		return default_;
	else
		return qs[1];
}

var colID = 0;
var colUPC = 1;
var colDESC = 2;
var colPRICE = 3;
var colMEMPRICE = 4;
var colBRAND = 5;
var colDISCOUNTTYPE = 6;

//WIndows CE does not support CurrentDir() so we have to define the full
//working path to our database, otherwise it will end up in root as '/items.db'
var dbNAME = "/PermStorage/CORE/includes/items.db";
var dbCONN = "LiteX.LiteConnection";
var dbSTMT = "LiteX.LiteStatement";
var dbSQL = "SELECT * FROM items WHERE upc='";

var sPrice = " ";
var sDesc = "Item not found";

function dbError( e )
{
	alert("Error: " + e.number + "\n" + e.description);
}

function dbData( type, value )
{
	var sResult = new String();
	switch( type )
	{
	    case 0 /*lxNull*/: sResult = "NULL"; break;
		case 6/*lxBinary*/: sResult = "BLOB"; break;
		default: sResult = value; break;
	}
	return sResult;
}

function dbLookup(upc)
{
	var sql = dbSQL + upc + "';";
	var ret = false;
	//alert(sql);
	try
	{
		var oDb = new ActiveXObject( dbCONN );
		var oStmt = new ActiveXObject( dbSTMT );

		oDb.Open( dbNAME );
		oStmt = oDb.Prepare(sql);
		oStmt.Step();
		if ( !oStmt.Done )
		{
			sDesc = dbData( oStmt.ColumnType(colDESC), oStmt.ColumnValue(colDESC) );
			sPrice = dbData( oStmt.ColumnType(colPRICE), oStmt.ColumnValue(colPRICE) );
			sMemPrice = dbData( oStmt.ColumnType(colMEMPRICE), oStmt.ColumnValue(colMEMPRICE) );
			sBrand = dbData( oStmt.ColumnType(colBRAND), oStmt.ColumnValue(colBRAND) );
            		sDT = dbData( oStmt.ColumnType(colDISCOUNTTYPE), oStmt.ColumnValue(colDISCOUNTTYPE) );
			ret = true;
		}
	}
	catch( e )
	{
		dbError(e);
	}
	finally
	{
		oStmt.Close();
		oDb.Close();
		oStmt = null;
		oDb = null;
	}

	return ret;
}
