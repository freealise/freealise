/**************************************************************************/

// Copyright (c) 2014 David Bullock.

/**************************************************************************/

// Put the "use strict"; directive at the beginning of JavaScript code.
// It throws exceptions if you use undeclared variables, etc.

"use strict";

/**************************************************************************/

// IgnoreErrors can be set to true to ignore calls to ReportError().

var IgnoreErrors = 0;

// Report the given error string in a dialog box.

function ReportError(sError)
{
	if (! IgnoreErrors)
	{
		var bResult = confirm(sError);

		// Check if the user clicked OK (true) or Cancel (false).
		// If the user clicked Cancel, set IgnoreErrors to true.

		if (! bResult)
		{
			IgnoreErrors = 1;
		}
	}
}

/**************************************************************************/

// Handle onfocus event for the input textarea.

function SelectInput()
{
	try
	{
		// Select all the text in the "Input" textarea.

		var oInput = document.getElementById("Input");
		oInput.select();
	}
	catch (oError)
	{
		ReportError("SelectInput() error: " + oError);
	}
}

/**************************************************************************/

// Handle onclick event for the "Find These Words" button.

function CheckVocabulary()
{
	try
	{
		// Clear global variables.

		ClearGlobals();

		// Get the value of the "Input" <textarea>.

		var oInput = document.getElementById("Input");
		var sText = oInput.value;

		// Normalize the whitespace in the text:
		// Convert multiple whitespace characters to single spaces.
		// Trim whitespace from the beginning and end.

		sText = sText.replace(/ +/g," ");
		sText = sText.replace(/^ +/,"");
		sText = sText.replace(/ +$/,"");

		// Split the text into whitespace-separated tokens.

		var oTokenList = sText.replace(/ /g, '_').split(/\n/);

		// Process each input token.

		for (var iIndex = 0; iIndex < oTokenList.length; ++iIndex)
		{
			ProcessInput(oTokenList[iIndex]);
		}

		// Set the HTML inside the "Output" <div>.

		var oOutput = document.getElementById("Output");
		oOutput.innerHTML = GenerateOutput();
		
		alert(primes);
	}
	catch (oError)
	{
		ReportError("CheckVocabulary() error: " + oError);
	}
}

/**************************************************************************/

var primes = [];

// TokenList[index] = Output HTML <a...>token</a> for each input token.

var TokenList = new Array();

var Layer0List = new Object();

// Layer1List["root"] = Output HTML <a...>root</a> for the given Layer1 root.

var Layer1List = new Object();

// Layer2List["root"] = Output HTML <a...>root</a> for the given Layer2 root.

var Layer2List = new Object();

// Layer3List["stem"] = Output HTML <a...>word</a> for the given Layer3 stem.

var Layer3List = new Object();

// Clear the TokenList, Layer1List, Layer2List and Layer3List arrays.

function ClearGlobals()
{
	TokenList = new Array();
	Layer0List = new Object();
	Layer1List = new Object();
	Layer2List = new Object();
	Layer3List = new Object();
}

/**************************************************************************/

// For the given input token, append an HTML string to the TokenList array.
// Also add to the appropriate Layer1List or Layer2List or Layer3List array.

function ProcessInput(sToken)
{
	// Trim non-alpha characters from the beginning and end of the word.

	var sWord = CleanWord(sToken);

	// See if the word has a root in the Layer1Root array (from the lessons).
	
	var sRoot = FindLayer0Root(sWord);
	if (sRoot)
	{
		// Add a link from the token to the root in the alphabetical index.

		TokenList.push(MakeLayer0Link(sToken,sRoot));

		// Map the root to an HTML link to the root.

		Layer0List[sRoot] = MakeLayer0Link(sRoot,sRoot);
		return;
	}

	sRoot = FindLayer1Root(sWord);
	if (sRoot)
	{
		// Add a link from the token to the root in the alphabetical index.

		TokenList.push(MakeLayer1Link(sToken,sRoot));

		// Map the root to an HTML link to the root.

		Layer1List[sRoot] = MakeLayer1Link(sRoot,sRoot);
		return;
	}

	// See if the word has a root in the Layer2Root array (defining vocabulary).

	sRoot = FindLayer2Root(sWord);
	if (sRoot)
	{
		// Add a link from the token to the root in the alphabetical index.

		TokenList.push(MakeLayer2Link(sToken,sRoot));

		// Map the root to an HTML link to the root.

		Layer2List[sRoot] = MakeLayer2Link(sRoot,sRoot);
		return;
	}

	// If the word is not blank, we'll look it up in the Longman Dictionary.

	if (sWord)
	{
		// Add a link from the token to the word in the Longman Dictionary.

		TokenList.push(MakeLayer3Link(sToken,sWord));

		// Map the stem to an HTML link to the word in the Longman Dictionary.
		// If the stem is already mapped, keep the shortest link string.

		var sStem = CreateStem(sWord);
		var sNewLink = MakeLayer3Link(sWord,sWord);
		var sOldLink = Layer3List[sStem];
		if (sOldLink)
		{
			if (sNewLink.length < sOldLink.length)
			{
				Layer3List[sStem] = sNewLink;
			}
		}
		else
		{
			Layer3List[sStem] = sNewLink;
		}
		return;
	}

	// Otherwise, we'll just display the token with no link.

	TokenList.push(EscapeHtml(sToken));
}

/**************************************************************************/

// Return an HTML string that displays the tokens from the TokenList array,
// and also the word groups from the Layer1List, Layer2List and Layer3List arrays.

function GenerateOutput()
{
	// Join the HTML strings from the TokenList array.

	var sOutput = "<p>" + TokenList.join("<br/>") + "</p>";
	
	sOutput = sOutput + "<p><b>Basic words from ";
	sOutput = sOutput + "<i>Learn These Words First</i>:</b></p>";
	sOutput = sOutput + "<p>" + SortKeysAndJoin(Layer0List) + "</p>";

	// Join the HTML strings from the Layer1List array.

	sOutput = sOutput + "<p><b>Words from the ";
	sOutput = sOutput + "<i>Learn These Words First</i> lessons:</b></p>";
	sOutput = sOutput + "<p>" + SortKeysAndJoin(Layer1List) + "</p>";

	// Join the HTML strings from the Layer2List array.

	sOutput = sOutput + "<p><b>More words explained inside ";
	sOutput = sOutput + "<i>Learn These Words First</i>:</b></p>";
	sOutput = sOutput + "<p>" + SortKeysAndJoin(Layer2List) + "</p>";

	// Join the HTML strings from the Layer3List array.

	sOutput = sOutput + "<p><b>Words to find inside the ";
	sOutput = sOutput + "<i>Longman English Dictionary Online</i>:</b></p>";
	sOutput = sOutput + "<p>" + SortKeysAndJoin(Layer3List) + "</p>";

	// Return the HTML output.

	return sOutput;
}

// Do a case-insensitive string comparison (sort-order function used by Array.sort()).

function CaseInsensitiveCompare(sString1,sString2)
{
	sString1 = sString1.toLowerCase();
	sString2 = sString2.toLowerCase();
	if (sString1 < sString2)
	{
		return -1;
	}
	if (sString1 > sString2)
	{
		return 1;
	}
	return 0;
}

// Return a string formed by joining the values from the given associative array.
// The order of the values is determined by a case-insensitive sort of the keys.

function SortKeysAndJoin(oLayerList)
{
	// Get the keys from the given associative array.

	var oKeyArray = new Array();
	for (var sKey in oLayerList)
	{
		oKeyArray.push(sKey);
	}

	// Sort the keys using a case-insensitive comparison.

	oKeyArray.sort(CaseInsensitiveCompare);

	// Get the values from the associative array in the order of the sorted keys.

	var oValueArray = new Array();
	for (var iIndex = 0; iIndex < oKeyArray.length; ++iIndex)
	{
		oValueArray[iIndex] = oLayerList[oKeyArray[iIndex]];
	}

	// Return the string formed by joining the values (separated by spaces).

	return oValueArray.join(" ");
}

/**************************************************************************/

// Return the given string with "&", "<" and ">" characters escaped.

function EscapeHtml(sToken)
{
	// Replace "&", "<" and ">" characters with HTML entities.

	sToken = sToken.replace(/\&/g,"&amp;");
	sToken = sToken.replace(/\</g,"&lt;");
	sToken = sToken.replace(/\>/g,"&gt;");
	return sToken;
}

// Return the given string with non-alpha characters trimmed.

function CleanWord(sToken)
{
	// Trim non-alpha characters from beginning and end of string.

	var sWord = sToken;
	sWord = sWord.replace(/^[^a-z\-]+/i,"");
	sWord = sWord.replace(/[^a-z\-]+$/i,"");

	// Replace curly unicode single quote (\u2019) with apostrophe.

	sWord = sWord.replace(/\u2019/g,"'");

	// Return the cleaned word.

	return sWord;
}

// Return the given string with non-alpha characters changed to hyphens.

function ReplaceNonAlpha(sWord)
{
	sWord = sWord.replace(/[^a-z]+/ig,"-");
	return sWord;
}

/**************************************************************************/

function MakeLayer0Link(sToken,sRoot)
{
	// Replace special characters in the strings.

	sToken = EscapeHtml(sToken);
	sRoot = ReplaceNonAlpha(sRoot);

	// Make a reference to the correct file and anchor in the alphabetical index.

	var sHref = MakeIndexHref(sRoot);

	// Make a class='Layer1' (black) link and return the HTML string.

	var sLink = "<div class='a'><a class='Layer0' href='" + sHref + "' ";
	sLink = sLink + "target='_blank'>" + sToken + "</a></div>";
	
	if (primes.indexOf(sRoot) == -1) {
	    primes[primes.length] = sRoot;
	}
	
	return sLink;
}

// Return a Layer1 link from the given token to the root in the alphabetical index.

function MakeLayer1Link(sToken,sRoot)
{
	// Replace special characters in the strings.

	sToken = EscapeHtml(sToken);
	sRoot = ReplaceNonAlpha(sRoot);

	// Make a reference to the correct file and anchor in the alphabetical index.

	var sHref = MakeIndexHref(sRoot);

	// Make a class='Layer1' (black) link and return the HTML string.

	var sLink = "<div class='a'><a class='Layer1' href='" + sHref + "' ";
	sLink = sLink + "target='_blank'>" + sToken + "</a></div>";
	return sLink;
}

// Return a Layer2 link from the given token to the root in the alphabetical index.

function MakeLayer2Link(sToken,sRoot)
{
	// Replace special characters in the strings.

	sToken = EscapeHtml(sToken);
	sRoot = ReplaceNonAlpha(sRoot);

	// Make a reference to the correct file and anchor in the alphabetical index.

	var sHref = MakeIndexHref(sRoot);

	// Make a class='Layer2' (blue) link and return the HTML string.

	var sLink = "<div class='a'><a class='Layer2' href='" + sHref + "' ";
	sLink = sLink + "target='_blank'>" + sToken + "</a></div>";
	return sLink;
}

// Return a reference to the file and anchor of the root in the alphabetical index.

function MakeIndexHref(sRoot)
{
	// The filename is determined by the starting letter of the root.

	var sFilename = "LearnTheseWordsFirst.html";
	if (sRoot.match(/^[A]/i))
	{
		sFilename = "Words-A.html";
	}
	if (sRoot.match(/^[B]/i))
	{
		sFilename = "Words-B.html";
	}
	if (sRoot.match(/^[C]/i))
	{
		sFilename = "Words-C.html";
	}
	if (sRoot.match(/^[D]/i))
	{
		sFilename = "Words-D.html";
	}
	if (sRoot.match(/^[E]/i))
	{
		sFilename = "Words-E.html";
	}
	if (sRoot.match(/^[F]/i))
	{
		sFilename = "Words-F.html";
	}
	if (sRoot.match(/^[GH]/i))
	{
		sFilename = "Words-GH.html";
	}
	if (sRoot.match(/^[IJK]/i))
	{
		sFilename = "Words-IJK.html";
	}
	if (sRoot.match(/^[LM]/i))
	{
		sFilename = "Words-LM.html";
	}
	if (sRoot.match(/^[NO]/i))
	{
		sFilename = "Words-NO.html";
	}
	if (sRoot.match(/^[P]/i))
	{
		sFilename = "Words-P.html";
	}
	if (sRoot.match(/^[QR]/i))
	{
		sFilename = "Words-QR.html";
	}
	if (sRoot.match(/^[S]/i))
	{
		sFilename = "Words-S.html";
	}
	if (sRoot.match(/^[T]/i))
	{
		sFilename = "Words-T.html";
	}
	if (sRoot.match(/^[UVWXYZ]/i))
	{
		sFilename = "Words-UVWXYZ.html";
	}

	// The start of the definition is indicated using the root as the anchor.
	// Append the root string as the anchor identifier and return the reference.

	var sHref = "https://learnthesewordsfirst.com/" + sFilename + "#" + sRoot;
	return sHref;
}

// Return a Layer3 link from the given token to the word in the Longman Dictionary.

function MakeLayer3Link(sToken,sWord)
{
	// Replace special characters in the strings.

	sToken = EscapeHtml(sToken);
	sWord = ReplaceNonAlpha(sWord);

	// Make a reference to the Longman Dictionary search page.
	// Put the word in the query string (?q=word).

	var sHref = "http://www.ldoceonline.com/search/?q=" + sWord;

	// Make a class='Layer3' (red) link and return the HTML string.

	var sLink = "<a class='Layer3' href='" + sHref + "' ";
	sLink = sLink + "target='_blank'>" + sToken + "</a>";
	return sLink;
}

/**************************************************************************/

var Layer0Root = null;

// Layer1Root["stem"] = The Layer1 root (first headword) for the given stem.
// The Layer1Root array gets initialized with words from the lessons.

var Layer1Root = null;

// Layer2Root["stem"] = The Layer2 root (first headword) for the given stem.
// The Layer2Root array gets initialized with words from the defining vocabulary.

var Layer2Root = null;

function FindLayer0Root(sWord)
{
	// Initialize Layer1Root and Layer2Root arrays, if not already initialized.

	if ((! Layer0Root) || (! Layer1Root) || (! Layer2Root))
	{
	    Layer0Root = new Object();
		Layer1Root = new Object();
		Layer2Root = new Object();
		InitializeRoots();
	}

	// Get the stem for the given word and look up the associated Layer1 root.
	// If the root is found, return it. Otherwise, return null.

	var sStem = CreateStem(sWord);
	var sRoot = Layer0Root[sStem];
	if (sRoot)
	{
		return sRoot;
	}
	return null;
}

// Return the root of the given word in Layer1 (or null if the word was not found).

function FindLayer1Root(sWord)
{
	// Initialize Layer1Root and Layer2Root arrays, if not already initialized.

	if ((! Layer0Root) || (! Layer1Root) || (! Layer2Root))
	{
	    Layer0Root = new Object();
		Layer1Root = new Object();
		Layer2Root = new Object();
		InitializeRoots();
	}

	// Get the stem for the given word and look up the associated Layer1 root.
	// If the root is found, return it. Otherwise, return null.

	var sStem = CreateStem(sWord);
	var sRoot = Layer1Root[sStem];
	if (sRoot)
	{
		return sRoot;
	}
	return null;
}

// Return the root of the given word in Layer2 (or null if the word was not found).

function FindLayer2Root(sWord)
{
	// Initialize Layer1Root and Layer2Root arrays, if not already initialized.

	if ((! Layer0Root) || (! Layer1Root) || (! Layer2Root))
	{
	    Layer0Root = new Object();
		Layer1Root = new Object();
		Layer2Root = new Object();
		InitializeRoots();
	}

	// Get the stem for the given word and look up the associated Layer2 root.
	// If the root is found, return it. Otherwise, return null.

	var sStem = CreateStem(sWord);
	var sRoot = Layer2Root[sStem];
	if (sRoot)
	{
		return sRoot;
	}
	return null;
}

function AddLayer0Root(sWordList)
{
	// Split the space-separated list of words.
	// It contains a root word followed by its irregular inflections and variants.
	// For example: "see saw seen".

	var oWordList = sWordList.split(/ /);

	// Map the stem of each word in the list.

	for (var iIndex = 0; iIndex < oWordList.length; ++iIndex)
	{
		var sStem = CreateStem(oWordList[iIndex]);

		// If the stem is not already mapped,
		// map it to the root (the first word in the list).

		if (! Layer0Root[sStem])
		{
			var sRoot = oWordList[0];
			Layer0Root[sStem] = sRoot;
		}
	}
}

// Given a string containing a root word followed by its irregular inflections,
// map the stem of each word to the root word in the Layer1Root array.

function AddLayer1Root(sWordList)
{
	// Split the space-separated list of words.
	// It contains a root word followed by its irregular inflections and variants.
	// For example: "see saw seen".

	var oWordList = sWordList.split(/ /);

	// Map the stem of each word in the list.

	for (var iIndex = 0; iIndex < oWordList.length; ++iIndex)
	{
		var sStem = CreateStem(oWordList[iIndex]);

		// If the stem is not already mapped,
		// map it to the root (the first word in the list).

		if (! Layer1Root[sStem])
		{
			var sRoot = oWordList[0];
			Layer1Root[sStem] = sRoot;
		}
	}
}

// Given a string containing a root word followed by its irregular inflections,
// map the stem of each word to the root word in the Layer2Root array.

function AddLayer2Root(sWordList)
{
	// Split the space-separated list of words.
	// It contains a root word followed by its irregular inflections and variants.
	// For example: "dream dreamt".

	var oWordList = sWordList.split(/ /);

	// Map the stem of each word in the list.

	for (var iIndex = 0; iIndex < oWordList.length; ++iIndex)
	{
		var sStem = CreateStem(oWordList[iIndex]);

		// If the stem is not already mapped,
		// map it to the root (the first word in the list).

		if (! Layer2Root[sStem])
		{
			var sRoot = oWordList[0];
			Layer2Root[sStem] = sRoot;
		}
	}
}

// Return a lowercase stem for the given word after removing regular inflections.

function CreateStem(sWord)
{
	// Change the word to lowercase.

	var sStem = sWord.toLowerCase();

	// Remove possessive ending: "-'s".

	var iLength = sStem.length;
	if (sStem.match(/\'s$/))
	{
		iLength = sStem.length - 2;
	}
	sStem = TruncateStem(sStem,iLength);

	// Remove regular noun and verb inflections: "-s", "-ed", "-ing".

	iLength = sStem.length;
	if (sStem.match(/s$/))
	{
		iLength = sStem.length - 1;
	}
	if (sStem.match(/ed$/))
	{
		iLength = sStem.length - 2;
	}
	if (sStem.match(/ing$/))
	{
		iLength = sStem.length - 3;
	}
	sStem = TruncateStem(sStem,iLength);

	// Remove final vowels that change in regular inflections: "i", "e", "ie", "y".

	iLength = sStem.length;
	if (sStem.match(/i$/))
	{
		iLength = sStem.length - 1;
	}
	if (sStem.match(/e$/))
	{
		iLength = sStem.length - 1;
	}
	if (sStem.match(/ie$/))
	{
		iLength = sStem.length - 2;
	}
	if (sStem.match(/y$/))
	{
		iLength = sStem.length - 1;
	}
	sStem = TruncateStem(sStem,iLength);

	// Change doubled final consonants to a single consonant.

	iLength = sStem.length;
	if (sStem.match(/(bb|cc|dd|ff|gg|hh|jj|kk|ll|mm)$/))
	{
		iLength = sStem.length - 1;
	}
	if (sStem.match(/(nn|pp|qq|rr|ss|tt|vv|ww|xx|zz)$/))
	{
		iLength = sStem.length - 1;
	}
	sStem = TruncateStem(sStem,iLength);

	// Return the stem.
	// The rules try to create the same stem for inflected forms of the same word.
	// This works for most words, but there are some collisions and problem cases.
	// Example problems: they, the, here, her, need, needs, this, thing, things.
	// Fortunately, the problem cases tend to be close in the alphabetical index.

	return sStem;
}

// Returns the given stem string, truncated to the given length.
// The length of the stem will not be reduced to less than 3 characters.

function TruncateStem(sStem,iLength)
{
	if (sStem.length > 3)
	{
		if (iLength < 3)
		{
			iLength = 3;
		}
		sStem = sStem.substr(0,iLength);
	}
	return sStem;
}

/**************************************************************************/

// Initialize the contents of the Layer1Root and Layer2Root arrays.

function InitializeRoots()
{
	AddLayer0Root("see saw seen");
	AddLayer0Root("thing");
	AddLayer0Root("something");
	AddLayer0Root("what");
	AddLayer0Root("this");
	AddLayer0Root("these");
	AddLayer0Root("other");
	AddLayer0Root("another");
	AddLayer0Root("else");
	AddLayer0Root("same");
	AddLayer0Root("be am are is being was were been");
	AddLayer0Root("am are");
	AddLayer0Root("is");
	AddLayer0Root("was were");
	AddLayer0Root("as");
	AddLayer0Root("one");
	AddLayer0Root("two");
	AddLayer0Root("person people");
	AddLayer0Root("many");
	AddLayer0Root("much");
	AddLayer0Root("inside");
	AddLayer0Root("not");
	AddLayer0Root("some");
	AddLayer0Root("all");
	AddLayer0Root("there");
	AddLayer0Root("more");
	AddLayer0Root("than");
	AddLayer0Root("live");
	AddLayer0Root("alive");
	AddLayer0Root("big");
	AddLayer0Root("small");
	AddLayer0Root("very");
	AddLayer0Root("kind");
	AddLayer0Root("if");
	AddLayer0Root("touch");
	AddLayer0Root("far");
	AddLayer0Root("near");
	AddLayer0Root("place");
	AddLayer0Root("someplace");
	AddLayer0Root("where");
	AddLayer0Root("in");
	AddLayer0Root("above");
	AddLayer0Root("side");
	AddLayer0Root("on");
	AddLayer0Root("hear heard");
	AddLayer0Root("say said");
	AddLayer0Root("about");
	AddLayer0Root("word");
	AddLayer0Root("true");
	AddLayer0Root("like");
	AddLayer0Root("have has had");
	AddLayer0Root("belong");
	AddLayer0Root("part");
	AddLayer0Root("of");
	AddLayer0Root("do does doing did done");
	AddLayer0Root("with");
	AddLayer0Root("happen");
	AddLayer0Root("because");
	AddLayer0Root("think thought");
	AddLayer0Root("know knew known");
	AddLayer0Root("want");
	AddLayer0Root("can could");
	AddLayer0Root("could");
	AddLayer0Root("cannot");
	AddLayer0Root("bad");
	AddLayer0Root("good");
	AddLayer0Root("well");
	AddLayer0Root("feel felt");
	AddLayer0Root("feeling");
	AddLayer2Root("feelings");
	AddLayer0Root("time");
	AddLayer0Root("when");
	AddLayer0Root("at");
	AddLayer0Root("before");
	AddLayer0Root("short");
	AddLayer0Root("move");
	AddLayer0Root("to");
	AddLayer0Root("I");
	AddLayer0Root("me");
	AddLayer0Root("you");
	AddLayer0Root("here");
	AddLayer0Root("now");
	AddLayer0Root("someone");
	AddLayer0Root("who");
	AddLayer0Root("whom");
	AddLayer0Root("after");
	AddLayer0Root("for");
	AddLayer0Root("moment");
	AddLayer0Root("body");
	AddLayer0Root("die dying");
	AddLayer0Root("dead");
	AddLayer0Root("maybe");
	AddLayer0Root("below");
	AddLayer1Root("that");
	AddLayer2Root("those");
	AddLayer1Root("and");
	AddLayer1Root("or");
	AddLayer1Root("it");
	AddLayer1Root("they");
	AddLayer1Root("them");
	AddLayer1Root("its");
	AddLayer1Root("their");
	AddLayer1Root("your");
	AddLayer1Root("my");
	AddLayer1Root("a");
	AddLayer1Root("an");
	AddLayer1Root("the");
	AddLayer1Root("animal");
	AddLayer1Root("cause");
	AddLayer1Root("but");
	AddLayer1Root("use using");
	AddLayer1Root("each");
	AddLayer1Root("exist");
	AddLayer1Root("become became");
	AddLayer1Root("different");
	AddLayer1Root("make made");
	AddLayer1Root("contain");
	AddLayer1Root("container");
	AddLayer1Root("try tries tried");
	AddLayer1Root("change");
	AddLayer1Root("surface");
	AddLayer1Root("choose chose chosen");
	AddLayer1Root("between");
	AddLayer1Root("from");
	AddLayer1Root("machine");
	AddLayer1Root("damage");
	AddLayer1Root("difficult");
	AddLayer1Root("easy easily");
	AddLayer1Root("control");
	AddLayer1Root("put");
	AddLayer1Root("able");
	AddLayer1Root("shape");
	AddLayer1Root("colour color");
	AddLayer1Root("towards");
	AddLayer1Root("hold held");
	AddLayer1Root("pull");
	AddLayer1Root("then");
	AddLayer1Root("out");
	AddLayer1Root("into");
	AddLayer1Root("eye");
	AddLayer1Root("look");
	AddLayer1Root("mark");
	AddLayer1Root("write wrote written");
	AddLayer2Root("follow");
	AddLayer1Root("draw drew drawn");
	AddLayer1Root("plan");
	AddLayer1Root("expect");
	AddLayer1Root("important");
	AddLayer1Root("tell told");
	AddLayer1Root("less");
	AddLayer2Root("outside");
	AddLayer1Root("will");
	AddLayer2Root("would");
	AddLayer1Root("through");
	AddLayer2Root("must");
	AddLayer2Root("nothing");
	AddLayer1Root("need");
	AddLayer1Root("most");
	AddLayer1Root("bottom");
	AddLayer1Root("down");
	AddLayer1Root("air");
	AddLayer1Root("breathe");
	AddLayer1Root("eat ate eaten");
	AddLayer1Root("ate");
	AddLayer1Root("food");
	AddLayer1Root("gas");
	AddLayer2Root("main");
	AddLayer1Root("solid");
	AddLayer1Root("hole");
	AddLayer1Root("liquid");
	AddLayer2Root("new");
	AddLayer1Root("three");
	AddLayer1Root("four");
	AddLayer1Root("five");
	AddLayer1Root("group");
	AddLayer1Root("child children");
	AddLayer1Root("female");
	AddLayer1Root("male");
	AddLayer1Root("parent");
	AddLayer1Root("mouth");
	AddLayer1Root("drink drank drunk");
	AddLayer1Root("drunk");
	AddLayer1Root("young");
	AddLayer1Root("milk");
	AddLayer1Root("end");
	AddLayer1Root("up");
	AddLayer1Root("lift");
	AddLayer1Root("long");
	AddLayer1Root("grow grew grown");
	AddLayer1Root("heavy");
	AddLayer1Root("length");
	AddLayer2Root("fasten");
	AddLayer1Root("connect");
	AddLayer2Root("any");
	AddLayer2Root("mother");
	AddLayer2Root("produce");
	AddLayer2Root("product");
	AddLayer2Root("production");
	AddLayer1Root("often");
	AddLayer1Root("white");
	AddLayer1Root("light lit");
	AddLayer2Root("build built");
	AddLayer1Root("building");
	AddLayer1Root("number");
	AddLayer1Root("count");
	AddLayer1Root("enjoy");
	AddLayer1Root("water");
	AddLayer1Root("plant");
	AddLayer1Root("ground");
	AddLayer1Root("dry dries dried");
	AddLayer2Root("purpose");
	AddLayer2Root("point");
	AddLayer2Root("pointed");
	AddLayer2Root("half halves");
	AddLayer1Root("distance");
	AddLayer1Root("narrow");
	AddLayer1Root("wide");
	AddLayer1Root("several");
	AddLayer1Root("top");
	AddLayer1Root("front");
	AddLayer1Root("back");
	AddLayer1Root("behind");
	AddLayer2Root("fast");
	AddLayer1Root("quick quickly");
	AddLayer1Root("centre center");
	AddLayer1Root("round");
	AddLayer1Root("around");
	AddLayer2Root("land");
	AddLayer2Root("width");
	AddLayer2Root("stay");
	AddLayer1Root("sound");
	AddLayer1Root("loud");
	AddLayer2Root("anything");
	AddLayer1Root("high");
	AddLayer1Root("low");
	AddLayer1Root("prevent");
	AddLayer2Root("height");
	AddLayer1Root("fall fell fallen");
	AddLayer1Root("head");
	AddLayer1Root("hit");
	AddLayer1Root("stop");
	AddLayer2Root("temperature");
	AddLayer1Root("hot");
	AddLayer1Root("cold");
	AddLayer1Root("compare");
	AddLayer1Root("weight");
	AddLayer1Root("measure");
	AddLayer1Root("flat");
	AddLayer1Root("green");
	AddLayer1Root("thin");
	AddLayer1Root("tree");
	AddLayer2Root("both");
	AddLayer2Root("space");
	AddLayer2Root("spacecraft");
	AddLayer1Root("carry");
	AddLayer2Root("except");
	AddLayer1Root("sleep slept");
	AddLayer1Root("arm");
	AddLayer1Root("arms");
	AddLayer1Root("hand");
	AddLayer1Root("adult");
	AddLayer2Root("born");
	AddLayer2Root("under");
	AddLayer1Root("man men");
	AddLayer1Root("woman women");
	AddLayer1Root("he");
	AddLayer1Root("him");
	AddLayer1Root("his");
	AddLayer1Root("she");
	AddLayer1Root("her");
	AddLayer2Root("close");
	AddLayer2Root("little");
	AddLayer2Root("curve");
	AddLayer2Root("movement");
	AddLayer2Root("heat");
	AddLayer2Root("thick");
	AddLayer2Root("bend bent");
	AddLayer2Root("sudden");
	AddLayer2Root("begin began begun");
	AddLayer2Root("beginning");
	AddLayer2Root("photograph");
	AddLayer2Root("photography");
	AddLayer1Root("start");
	AddLayer2Root("combine");
	AddLayer2Root("shoot shot");
	AddLayer2Root("shot");
	AddLayer2Root("oxygen");
	AddLayer2Root("fire");
	AddLayer2Root("fireplace");
	AddLayer1Root("burn burnt");
	AddLayer2Root("limb");
	AddLayer2Root("gentle");
	AddLayer2Root("copy");
	AddLayer2Root("model");
	AddLayer2Root("pattern");
	AddLayer1Root("music");
	AddLayer1Root("hurt");
	AddLayer1Root("hard");
	AddLayer2Root("stiff");
	AddLayer1Root("press");
	AddLayer2Root("always");
	AddLayer1Root("promise");
	AddLayer1Root("sexual");
	AddLayer1Root("marry");
	AddLayer1Root("married");
	AddLayer1Root("family");
	AddLayer1Root("likely");
	AddLayer1Root("cut");
	AddLayer2Root("talk");
	AddLayer2Root("beat beaten");
	AddLayer1Root("piece");
	AddLayer1Root("taste");
	AddLayer1Root("circle");
	AddLayer1Root("picture");
	AddLayer2Root("come came");
	AddLayer2Root("meet met");
	AddLayer2Root("meeting");
	AddLayer1Root("stone");
	AddLayer2Root("size");
	AddLayer2Root("dance");
	AddLayer2Root("join");
	AddLayer2Root("rock");
	AddLayer2Root("finger");
	AddLayer1Root("find found");
	AddLayer1Root("allow");
	AddLayer2Root("calculate");
	AddLayer2Root("calculator");
	AddLayer2Root("force");
	AddLayer2Root("soil");
	AddLayer2Root("increase");
	AddLayer2Root("drop");
	AddLayer2Root("middle");
	AddLayer2Root("total");
	AddLayer2Root("sum");
	AddLayer2Root("outer");
	AddLayer2Root("skin");
	AddLayer2Root("break broke broken");
	AddLayer2Root("handle");
	AddLayer1Root("turn");
	AddLayer2Root("power");
	AddLayer2Root("powerful");
	AddLayer2Root("smell");
	AddLayer2Root("dig dug");
	AddLayer2Root("tongue");
	AddLayer2Root("shiny");
	AddLayer2Root("shine shone");
	AddLayer2Root("melt");
	AddLayer2Root("knife");
	AddLayer1Root("metal");
	AddLayer1Root("vehicle");
	AddLayer1Root("hair");
	AddLayer2Root("leave left");
	AddLayer2Root("slope");
	AddLayer2Root("honest");
	AddLayer2Root("honesty");
	AddLayer2Root("immediately");
	AddLayer1Root("twist");
	AddLayer1Root("string");
	AddLayer1Root("six");
	AddLayer1Root("seven");
	AddLayer1Root("eight");
	AddLayer1Root("nine");
	AddLayer1Root("ten");
	AddLayer1Root("give gave given");
	AddLayer1Root("mix");
	AddLayer1Root("paper");
	AddLayer1Root("cover");
	AddLayer2Root("together");
	AddLayer2Root("agree");
	AddLayer2Root("agreement");
	AddLayer2Root("path");
	AddLayer2Root("bind bound");
	AddLayer2Root("while");
	AddLayer2Root("wind wound");
	AddLayer2Root("wound");
	AddLayer2Root("thread");
	AddLayer2Root("rope");
	AddLayer2Root("border");
	AddLayer2Root("wire");
	AddLayer1Root("rule");
	AddLayer2Root("govern");
	AddLayer1Root("government");
	AddLayer1Root("work");
	AddLayer2Root("understand understood");
	AddLayer2Root("mixture");
	AddLayer2Root("get got gotten");
	AddLayer2Root("exchange");
	AddLayer1Root("money");
	AddLayer2Root("harm");
	AddLayer2Root("harmful");
	AddLayer2Root("harmless");
	AddLayer1Root("leg");
	AddLayer2Root("protect");
	AddLayer2Root("protection");
	AddLayer2Root("protective");
	AddLayer1Root("help");
	AddLayer1Root("disease");
	AddLayer1Root("healthy");
	AddLayer1Root("straight");
	AddLayer1Root("sun");
	AddLayer1Root("day");
	AddLayer1Root("sky skies");
	AddLayer1Root("mean meant");
	AddLayer1Root("meaning");
	AddLayer1Root("means");
	AddLayer2Root("box");
	AddLayer1Root("hundred");
	AddLayer1Root("learn learnt");
	AddLayer1Root("seed");
	AddLayer1Root("fruit");
	AddLayer1Root("buy bought");
	AddLayer1Root("black");
	AddLayer2Root("kill");
	AddLayer2Root("enough");
	AddLayer2Root("keep kept");
	AddLayer2Root("skill");
	AddLayer2Root("skilful skillful");
	AddLayer1Root("clothing");
	AddLayer2Root("clothes");
	AddLayer1Root("cloth");
	AddLayer1Root("bread");
	AddLayer1Root("month");
	AddLayer1Root("year");
	AddLayer1Root("fly flies flew flown");
	AddLayer1Root("bird");
	AddLayer1Root("egg");
	AddLayer1Root("yellow");
	AddLayer1Root("red");
	AddLayer1Root("square");
	AddLayer1Root("electricity");
	AddLayer1Root("blood");
	AddLayer1Root("amount");
	AddLayer2Root("every");
	AddLayer2Root("valuable");
	AddLayer2Root("value");
	AddLayer1Root("read");
	AddLayer2Root("teach taught");
	AddLayer2Root("nation");
	AddLayer2Root("national");
	AddLayer1Root("country");
	AddLayer1Root("soldier");
	AddLayer1Root("story");
	AddLayer2Root("sell sold");
	AddLayer1Root("push");
	AddLayer1Root("atom");
	AddLayer1Root("chemical");
	AddLayer1Root("sweet");
	AddLayer2Root("illness");
	AddLayer2Root("ill");
	AddLayer2Root("asleep");
	AddLayer2Root("pleasant");
	AddLayer2Root("catch caught");
	AddLayer2Root("detail");
	AddLayer2Root("entertain");
	AddLayer2Root("entertainment");
	AddLayer1Root("foot feet");
	AddLayer1Root("play");
	AddLayer1Root("game");
	AddLayer2Root("powder");
	AddLayer2Root("leaf leaves");
	AddLayer2Root("cook");
	AddLayer2Root("remove");
	AddLayer2Root("remember");
	AddLayer2Root("note");
	AddLayer2Root("until");
	AddLayer2Root("obey");
	AddLayer2Root("obedient");
	AddLayer1Root("beautiful");
	AddLayer2Root("reason");
	AddLayer2Root("reasonable");
	AddLayer2Root("receive");
	AddLayer2Root("believe");
	AddLayer2Root("pain");
	AddLayer2Root("painful");
	AddLayer2Root("worry");
	AddLayer2Root("afraid");
	AddLayer2Root("continue");
	AddLayer2Root("continuous");
	AddLayer2Root("decorate");
	AddLayer2Root("decoration");
	AddLayer2Root("study");
	AddLayer2Root("student");
	AddLayer2Root("funny");
	AddLayer2Root("king");
	AddLayer2Root("kingdom");
	AddLayer2Root("letter");
	AddLayer2Root("pole");
	AddLayer2Root("rain");
	AddLayer2Root("prepare");
	AddLayer2Root("preparation");
	AddLayer2Root("wear wore worn");
	AddLayer2Root("provide");
	AddLayer2Root("provision");
	AddLayer2Root("provisions");
	AddLayer2Root("walk");
	AddLayer2Root("bake");
	AddLayer2Root("command");
	AddLayer2Root("notice");
	AddLayer2Root("noticeable");
	AddLayer2Root("insect");
	AddLayer2Root("usual usually");
	AddLayer2Root("foolish");
	AddLayer2Root("fool");
	AddLayer2Root("print");
	AddLayer2Root("order");
	AddLayer2Root("during");
	AddLayer2Root("information");
	AddLayer2Root("inform");
	AddLayer2Root("ceremony");
	AddLayer2Root("home");
	AddLayer2Root("queen");
	AddLayer2Root("kilometre kilometer");
	AddLayer2Root("centimetre centimeter");
	AddLayer2Root("mile");
	AddLayer2Root("yard");
	AddLayer2Root("gram");
	AddLayer2Root("pound");
	AddLayer2Root("litre liter");
	AddLayer1Root("thousand");
	AddLayer1Root("boat");
	AddLayer1Root("rub");
	AddLayer1Root("metre meter");
	AddLayer2Root("especially");
	AddLayer2Root("whatever");
	AddLayer2Root("whenever");
	AddLayer2Root("whoever");
	AddLayer2Root("also");
	AddLayer2Root("formal");
	AddLayer2Root("act");
	AddLayer2Root("without");
	AddLayer2Root("so");
	AddLayer2Root("such");
	AddLayer2Root("position");
	AddLayer2Root("state");
	AddLayer2Root("statement");
	AddLayer2Root("certain");
	AddLayer2Root("phrase");
	AddLayer2Root("over");
	AddLayer2Root("particular");
	AddLayer2Root("action");
	AddLayer2Root("set");
	AddLayer2Root("oneself");
	AddLayer2Root("form");
	AddLayer2Root("mind");
	AddLayer2Root("large");
	AddLayer2Root("too");
	AddLayer2Root("off");
	AddLayer2Root("away");
	AddLayer2Root("great");
	AddLayer2Root("old");
	AddLayer2Root("quality");
	AddLayer2Root("technical");
	AddLayer2Root("against");
	AddLayer2Root("condition");
	AddLayer2Root("life lives");
	AddLayer2Root("period");
	AddLayer2Root("degree");
	AddLayer2Root("literature");
	AddLayer2Root("may");
	AddLayer2Root("result");
	AddLayer2Root("type");
	AddLayer2Root("material");
	AddLayer2Root("special");
	AddLayer2Root("specialist");
	AddLayer2Root("ball");
	AddLayer2Root("combination");
	AddLayer2Root("comb");
	AddLayer2Root("behaviour behavior");
	AddLayer2Root("behave");
	AddLayer2Root("object");
	AddLayer2Root("run ran");
	AddLayer2Root("effect");
	AddLayer2Root("effective");
	AddLayer2Root("matter");
	AddLayer2Root("activity");
	AddLayer2Root("area");
	AddLayer2Root("rare");
	AddLayer2Root("just");
	AddLayer2Root("completely");
	AddLayer2Root("complete");
	AddLayer2Root("capital");
	AddLayer2Root("cap");
	AddLayer2Root("might");
	AddLayer2Root("edge");
	AddLayer2Root("even");
	AddLayer2Root("useful");
	AddLayer2Root("neck");
	AddLayer2Root("exact exactly");
	AddLayer2Root("minute");
	AddLayer2Root("second");
	AddLayer2Root("unit");
	AddLayer2Root("dollar");
	AddLayer2Root("cent");
	AddLayer2Root("pence");
	AddLayer2Root("sense");
	AddLayer2Root("senseless");
	AddLayer2Root("sensible");
	AddLayer2Root("face");
	AddLayer2Root("attack");
	AddLayer2Root("week");
	AddLayer2Root("weekly");
	AddLayer2Root("soft");
	AddLayer2Root("sick");
	AddLayer2Root("tail");
	AddLayer2Root("last");
	AddLayer2Root("deep");
	AddLayer2Root("succeed");
	AddLayer2Root("success");
	AddLayer2Root("successful");
	AddLayer2Root("flour");
	AddLayer2Root("smoke");
	AddLayer2Root("table");
	AddLayer2Root("ability");
	AddLayer2Root("climb");
	AddLayer2Root("magic");
	AddLayer2Root("magician");
	AddLayer2Root("travel");
	AddLayer2Root("aircraft");
	AddLayer2Root("airport");
	AddLayer2Root("flow");
	AddLayer2Root("deserve");
	AddLayer2Root("night");
	AddLayer2Root("jewellery jewelry");
	AddLayer2Root("jewel");
	AddLayer2Root("chest");
	AddLayer2Root("direction");
	AddLayer2Root("direct");
	AddLayer2Root("watch");
	AddLayer2Root("knee");
	AddLayer2Root("kneel knelt");
	AddLayer2Root("waist");
	AddLayer2Root("send sent");
	AddLayer2Root("punish");
	AddLayer2Root("punishment");
	AddLayer2Root("noise");
	AddLayer2Root("neat");
	AddLayer2Root("boil");
	AddLayer2Root("stomach");
	AddLayer2Root("organization");
	AddLayer2Root("organise organize");
	AddLayer2Root("argue");
	AddLayer2Root("argument");
	AddLayer2Root("fight fought");
	AddLayer2Root("represent");
	AddLayer2Root("representative");
	AddLayer2Root("again");
	AddLayer2Root("separate");
	AddLayer2Root("fail");
	AddLayer2Root("failure");
	AddLayer2Root("juice");
	AddLayer2Root("team");
	AddLayer2Root("explosion");
	AddLayer2Root("explosive");
	AddLayer2Root("lip");
	AddLayer2Root("military");
	AddLayer2Root("navy");
	AddLayer2Root("naval");
	AddLayer2Root("describe");
	AddLayer2Root("description");
	AddLayer2Root("descriptive");
	AddLayer2Root("excite");
	AddLayer2Root("excited");
	AddLayer2Root("exciting");
	AddLayer2Root("friend");
	AddLayer2Root("friendly");
	AddLayer2Root("ride rode ridden");
	AddLayer2Root("motor");
	AddLayer2Root("bowl");
	AddLayer2Root("glue");
	AddLayer2Root("fur");
	AddLayer2Root("quiet");
	AddLayer2Root("branch");
	AddLayer2Root("legal");
	AddLayer2Root("bury");
	AddLayer2Root("burial");
	AddLayer2Root("onto");
	AddLayer2Root("adjective");
	AddLayer2Root("adverb");
	AddLayer2Root("participle");
	AddLayer2Root("deliver");
	AddLayer2Root("elect");
	AddLayer2Root("election");
	AddLayer2Root("meat");
	AddLayer2Root("repair");
	AddLayer2Root("paint");
	AddLayer2Root("painting");
	AddLayer2Root("blade");
	AddLayer2Root("gun");
	AddLayer2Root("tooth teeth");
	AddLayer2Root("television");
	AddLayer2Root("signal");
	AddLayer2Root("station");
	AddLayer2Root("coin");
	AddLayer2Root("language");
	AddLayer2Root("owe owing");
	AddLayer2Root("owing_to");
	AddLayer2Root("poor");
	AddLayer2Root("satisfaction");
	AddLayer2Root("satisfactory");
	AddLayer2Root("satisfy");
	AddLayer2Root("sensitive");
	AddLayer2Root("slide slid");
	AddLayer2Root("sport");
	AddLayer2Root("weak");
	AddLayer2Root("worth");
	AddLayer2Root("worthy");
	AddLayer2Root("noble");
	AddLayer2Root("nobleman");
	AddLayer2Root("palace");
	AddLayer2Root("prince");
	AddLayer2Root("republic");
	AddLayer2Root("royal");
	AddLayer2Root("subject");
	AddLayer2Root("funeral");
	AddLayer2Root("occasion");
	AddLayer2Root("priest");
	AddLayer2Root("procession");
	AddLayer2Root("wedding");
	AddLayer2Root("average");
	AddLayer2Root("divide");
	AddLayer2Root("division");
	AddLayer2Root("rate");
	AddLayer2Root("scale");
	AddLayer1Root("show shown");
	AddLayer1Root("laugh");
	AddLayer1Root("wheel");
	AddLayer1Root("zero");
	AddLayer1Root("business");
	AddLayer1Root("hour");
	AddLayer1Root("clay");
	AddLayer1Root("explode");
	AddLayer1Root("happy");
	AddLayer1Root("angry");
	AddLayer1Root("fear");
	AddLayer1Root("radio");
	AddLayer1Root("sad");
	AddLayer1Root("careful carefully");
	AddLayer1Root("brown");
	AddLayer1Root("love");
	AddLayer1Root("tall");
	AddLayer1Root("name");
	AddLayer1Root("sit sat");
	AddLayer1Root("similar");
	AddLayer1Root("multiply");
	AddLayer1Root("alcohol");
	AddLayer1Root("fish");
	AddLayer1Root("grain");
	AddLayer1Root("salt");
	AddLayer1Root("fat");
	AddLayer1Root("coal");
	AddLayer1Root("kilogram");
	AddLayer1Root("sentence");
	AddLayer1Root("cat");
	AddLayer1Root("sour");
	AddLayer1Root("bone");
	AddLayer1Root("clean");
	AddLayer1Root("sheep");
	AddLayer1Root("decide");
	AddLayer1Root("god");
	AddLayer1Root("nose");
	AddLayer1Root("win won");
	AddLayer1Root("tube");
	AddLayer1Root("flower");
	AddLayer1Root("blue");
	AddLayer1Root("smooth");
	AddLayer1Root("school");
	AddLayer1Root("lead led");
	AddLayer1Root("book");
	AddLayer2Root("dis-");
	AddLayer2Root("im-");
	AddLayer2Root("in-");
	AddLayer2Root("ir-");
	AddLayer2Root("non-");
	AddLayer2Root("re-");
	AddLayer2Root("un-");
	AddLayer1Root("only");
	AddLayer1Root("go goes going went gone");
	AddLayer1Root("went");
	AddLayer1Root("we");
	AddLayer1Root("us");
	AddLayer1Root("pay paid");
	AddLayer2Root("payment");
	AddLayer1Root("first");
	AddLayer1Root("explain");
	AddLayer2Root("explanation");
	AddLayer1Root("by");
	AddLayer1Root("lesson");
	AddLayer1Root("take took taken");
	AddLayer1Root("better");
	AddLayer2Root("best");
	AddLayer1Root("own");
	AddLayer2Root("owner");
	AddLayer1Root("which");
	AddLayer2Root("whichever");
	AddLayer1Root("doctor");
	AddLayer1Root("police");
	AddLayer1Root("law");
	AddLayer1Root("ask");
	AddLayer1Root("question");
	AddLayer1Root("yes");
	AddLayer1Root("no");
	AddLayer1Root("room");
	AddLayer1Root("line");
	AddLayer1Root("toilet");
	AddLayer1Root("floor");
	AddLayer1Root("noun");
	AddLayer1Root("add");
	AddLayer2Root("addition");
	AddLayer2Root("additional");
	AddLayer1Root("sharp");
	AddLayer2Root("danger");
	AddLayer1Root("dangerous");
	AddLayer1Root("verb");
	AddLayer1Root("strong");
	AddLayer1Root("why");
	AddLayer1Root("how");
	AddLayer1Root("right");
	AddLayer1Root("left");
	AddLayer1Root("tool");
	AddLayer1Root("wood");
	AddLayer2Root("wooden");
	AddLayer1Root("dog");
	AddLayer1Root("ear");
	AddLayer1Root("car");
	AddLayer1Root("house");
	AddLayer1Root("hello");
	AddLayer1Root("please");
	AddLayer2Root("pleased");
	AddLayer1Root("thank");
	AddLayer1Root("sorry");
	AddLayer2Root("abbreviation");
	AddLayer2Root("abroad");
	AddLayer2Root("absence");
	AddLayer2Root("absent");
	AddLayer2Root("accept");
	AddLayer2Root("acceptable");
	AddLayer2Root("accident");
	AddLayer2Root("accidental");
	AddLayer2Root("accordance");
	AddLayer2Root("according according_to");
	AddLayer2Root("account");
	AddLayer2Root("ache");
	AddLayer2Root("achieve");
	AddLayer2Root("achievement");
	AddLayer2Root("acid");
	AddLayer2Root("across");
	AddLayer2Root("active");
	AddLayer2Root("actor");
	AddLayer2Root("actress");
	AddLayer2Root("actual");
	AddLayer2Root("actually");
	AddLayer2Root("address");
	AddLayer2Root("admire");
	AddLayer2Root("admiration");
	AddLayer2Root("admit");
	AddLayer2Root("admittance");
	AddLayer2Root("advance");
	AddLayer2Root("advanced");
	AddLayer2Root("advantage");
	AddLayer2Root("adventure");
	AddLayer2Root("advertise");
	AddLayer2Root("advertisement");
	AddLayer2Root("advice");
	AddLayer2Root("advise");
	AddLayer2Root("affair");
	AddLayer2Root("affect");
	AddLayer2Root("afford");
	AddLayer2Root("afternoon");
	AddLayer2Root("afterwards");
	AddLayer2Root("age");
	AddLayer2Root("ago");
	AddLayer2Root("ahead");
	AddLayer2Root("aim");
	AddLayer2Root("alike");
	AddLayer2Root("almost");
	AddLayer2Root("alone");
	AddLayer2Root("along");
	AddLayer2Root("aloud");
	AddLayer2Root("alphabet");
	AddLayer2Root("already");
	AddLayer2Root("although");
	AddLayer2Root("altogether");
	AddLayer2Root("among");
	AddLayer2Root("amuse");
	AddLayer2Root("amusement");
	AddLayer2Root("amusing");
	AddLayer2Root("ancient");
	AddLayer2Root("anger");
	AddLayer2Root("angle");
	AddLayer2Root("ankle");
	AddLayer2Root("announce");
	AddLayer2Root("annoy");
	AddLayer2Root("annoyance");
	AddLayer2Root("annoying");
	AddLayer2Root("answer");
	AddLayer2Root("ant");
	AddLayer2Root("anxiety");
	AddLayer2Root("anxious");
	AddLayer2Root("anybody");
	AddLayer2Root("anyhow");
	AddLayer2Root("anyone");
	AddLayer2Root("anywhere");
	AddLayer2Root("apart");
	AddLayer2Root("apartment");
	AddLayer2Root("apparatus");
	AddLayer2Root("appear");
	AddLayer2Root("appearance");
	AddLayer2Root("apple");
	AddLayer2Root("appoint");
	AddLayer2Root("approval");
	AddLayer2Root("approve");
	AddLayer2Root("arch");
	AddLayer2Root("armour armor");
	AddLayer2Root("army");
	AddLayer2Root("arrange");
	AddLayer2Root("arrangement");
	AddLayer2Root("arrival");
	AddLayer2Root("arrive");
	AddLayer2Root("art");
	AddLayer2Root("article");
	AddLayer2Root("artificial");
	AddLayer2Root("as_opposed_to");
	AddLayer2Root("ash");
	AddLayer2Root("ashamed");
	AddLayer2Root("aside");
	AddLayer2Root("association");
	AddLayer2Root("attempt");
	AddLayer2Root("attend");
	AddLayer2Root("attendance");
	AddLayer2Root("attention");
	AddLayer2Root("attitude");
	AddLayer2Root("attract");
	AddLayer2Root("attractive");
	AddLayer2Root("aunt");
	AddLayer2Root("authority");
	AddLayer2Root("autumn");
	AddLayer2Root("available");
	AddLayer2Root("avoid");
	AddLayer2Root("awake");
	AddLayer2Root("awkward");
	AddLayer2Root("baby");
	AddLayer2Root("background");
	AddLayer2Root("backward backwards");
	AddLayer2Root("bacteria");
	AddLayer2Root("bag");
	AddLayer2Root("balance");
	AddLayer2Root("banana");
	AddLayer2Root("band");
	AddLayer2Root("bank");
	AddLayer2Root("bar");
	AddLayer2Root("bare");
	AddLayer2Root("barrel");
	AddLayer2Root("base");
	AddLayer2Root("basic");
	AddLayer2Root("basket");
	AddLayer2Root("bath");
	AddLayer2Root("bathe");
	AddLayer2Root("battle");
	AddLayer2Root("beach");
	AddLayer2Root("beak");
	AddLayer2Root("beam");
	AddLayer2Root("bean");
	AddLayer2Root("bear bore borne");
	AddLayer2Root("beard");
	AddLayer2Root("beauty");
	AddLayer2Root("bed");
	AddLayer2Root("bee");
	AddLayer2Root("beer");
	AddLayer2Root("beg");
	AddLayer2Root("belief");
	AddLayer2Root("bell");
	AddLayer2Root("belt");
	AddLayer2Root("beneath");
	AddLayer2Root("berry");
	AddLayer2Root("beside");
	AddLayer2Root("besides");
	AddLayer2Root("beyond");
	AddLayer2Root("bicycle");
	AddLayer2Root("bill");
	AddLayer2Root("birth");
	AddLayer2Root("birthday");
	AddLayer2Root("bit");
	AddLayer2Root("bite bit bitten");
	AddLayer2Root("bitter");
	AddLayer2Root("blame");
	AddLayer2Root("bleed bled");
	AddLayer2Root("bless");
	AddLayer2Root("blind");
	AddLayer2Root("block");
	AddLayer2Root("blow blew");
	AddLayer2Root("board");
	AddLayer2Root("bomb");
	AddLayer2Root("boot");
	AddLayer2Root("bored");
	AddLayer2Root("boring");
	AddLayer2Root("borrow");
	AddLayer2Root("bottle");
	AddLayer2Root("bowels");
	AddLayer2Root("boy");
	AddLayer2Root("brain");
	AddLayer2Root("brass");
	AddLayer2Root("brave");
	AddLayer2Root("breadth");
	AddLayer2Root("breakfast");
	AddLayer2Root("breast");
	AddLayer2Root("breath");
	AddLayer2Root("breed bred");
	AddLayer2Root("brick");
	AddLayer2Root("bridge");
	AddLayer2Root("bright");
	AddLayer2Root("bring brought");
	AddLayer2Root("broad");
	AddLayer2Root("broadcast");
	AddLayer2Root("brother");
	AddLayer2Root("brush");
	AddLayer2Root("bucket");
	AddLayer2Root("bullet");
	AddLayer2Root("bunch");
	AddLayer2Root("burst");
	AddLayer2Root("bus");
	AddLayer2Root("bush");
	AddLayer2Root("busy");
	AddLayer2Root("butter");
	AddLayer2Root("button");
	AddLayer2Root("cage");
	AddLayer2Root("cake");
	AddLayer2Root("call");
	AddLayer2Root("calm");
	AddLayer2Root("camera");
	AddLayer2Root("camp");
	AddLayer2Root("candle");
	AddLayer2Root("captain");
	AddLayer2Root("card");
	AddLayer2Root("cardboard");
	AddLayer2Root("care");
	AddLayer2Root("careless");
	AddLayer2Root("carriage");
	AddLayer2Root("cart");
	AddLayer2Root("case");
	AddLayer2Root("castle");
	AddLayer2Root("cattle");
	AddLayer2Root("ceiling");
	AddLayer2Root("celebrate");
	AddLayer2Root("cell");
	AddLayer2Root("cement");
	AddLayer2Root("central");
	AddLayer2Root("century");
	AddLayer2Root("chain");
	AddLayer2Root("chair");
	AddLayer2Root("chairperson");
	AddLayer2Root("chalk");
	AddLayer2Root("chance");
	AddLayer2Root("character");
	AddLayer2Root("charge");
	AddLayer2Root("charm");
	AddLayer2Root("chase");
	AddLayer2Root("cheap");
	AddLayer2Root("cheat");
	AddLayer2Root("check");
	AddLayer2Root("cheek");
	AddLayer2Root("cheer");
	AddLayer2Root("cheerful");
	AddLayer2Root("cheese");
	AddLayer2Root("chemistry");
	AddLayer2Root("cheque check");
	AddLayer2Root("chicken");
	AddLayer2Root("chief");
	AddLayer2Root("childhood");
	AddLayer2Root("chimney");
	AddLayer2Root("chin");
	AddLayer2Root("chocolate");
	AddLayer2Root("choice");
	AddLayer2Root("church");
	AddLayer2Root("cigarette");
	AddLayer2Root("cinema");
	AddLayer2Root("circular");
	AddLayer2Root("citizen");
	AddLayer2Root("city");
	AddLayer2Root("civilization");
	AddLayer2Root("claim");
	AddLayer2Root("class");
	AddLayer2Root("clear");
	AddLayer2Root("clerk");
	AddLayer2Root("clever");
	AddLayer2Root("cliff");
	AddLayer2Root("clock");
	AddLayer2Root("clockwork");
	AddLayer2Root("cloud");
	AddLayer2Root("club");
	AddLayer2Root("coast");
	AddLayer2Root("coat");
	AddLayer2Root("coffee");
	AddLayer2Root("collar");
	AddLayer2Root("collect");
	AddLayer2Root("college");
	AddLayer2Root("comfort");
	AddLayer2Root("comfortable");
	AddLayer2Root("committee");
	AddLayer2Root("common");
	AddLayer2Root("communicate");
	AddLayer2Root("communication");
	AddLayer2Root("companion");
	AddLayer2Root("company");
	AddLayer2Root("comparison");
	AddLayer2Root("compete");
	AddLayer2Root("competition");
	AddLayer2Root("competitor");
	AddLayer2Root("complain");
	AddLayer2Root("complaint");
	AddLayer2Root("complicated");
	AddLayer2Root("compound");
	AddLayer2Root("computer");
	AddLayer2Root("concern");
	AddLayer2Root("concerning");
	AddLayer2Root("concert");
	AddLayer2Root("confidence");
	AddLayer2Root("confident");
	AddLayer2Root("confuse");
	AddLayer2Root("confusing");
	AddLayer2Root("connection");
	AddLayer2Root("conscience");
	AddLayer2Root("conscious");
	AddLayer2Root("consider");
	AddLayer2Root("consist consist_of");
	AddLayer2Root("consonant");
	AddLayer2Root("contents");
	AddLayer2Root("contract");
	AddLayer2Root("convenient");
	AddLayer2Root("conversation");
	AddLayer2Root("cool");
	AddLayer2Root("copper");
	AddLayer2Root("cord");
	AddLayer2Root("corn");
	AddLayer2Root("corner");
	AddLayer2Root("correct");
	AddLayer2Root("cost");
	AddLayer2Root("cotton");
	AddLayer2Root("cough");
	AddLayer2Root("council");
	AddLayer2Root("countryside");
	AddLayer2Root("courage");
	AddLayer2Root("course");
	AddLayer2Root("court");
	AddLayer2Root("cow");
	AddLayer2Root("coward");
	AddLayer2Root("cowardly");
	AddLayer2Root("crack");
	AddLayer2Root("crash");
	AddLayer2Root("crazy");
	AddLayer2Root("cream");
	AddLayer2Root("creature");
	AddLayer2Root("creep crept");
	AddLayer2Root("cricket");
	AddLayer2Root("crime");
	AddLayer2Root("criminal");
	AddLayer2Root("criticism");
	AddLayer2Root("criticize");
	AddLayer2Root("crop");
	AddLayer2Root("cross");
	AddLayer2Root("crowd");
	AddLayer2Root("cruel");
	AddLayer2Root("cruelty");
	AddLayer2Root("crush");
	AddLayer2Root("cry cries cried");
	AddLayer2Root("cultivate");
	AddLayer2Root("cup");
	AddLayer2Root("cupboard");
	AddLayer2Root("cure");
	AddLayer2Root("curl");
	AddLayer2Root("current");
	AddLayer2Root("curse");
	AddLayer2Root("curtain");
	AddLayer2Root("custom");
	AddLayer2Root("customer");
	AddLayer2Root("cycle");
	AddLayer2Root("daily");
	AddLayer2Root("dare");
	AddLayer2Root("daring");
	AddLayer2Root("dark");
	AddLayer2Root("date");
	AddLayer2Root("daughter");
	AddLayer2Root("deal dealt");
	AddLayer2Root("deal_with dealt_with");
	AddLayer2Root("dear");
	AddLayer2Root("death");
	AddLayer2Root("debt");
	AddLayer2Root("decay");
	AddLayer2Root("deceit");
	AddLayer2Root("deceive");
	AddLayer2Root("decimal");
	AddLayer2Root("decision");
	AddLayer2Root("declaration");
	AddLayer2Root("declare");
	AddLayer2Root("decrease");
	AddLayer2Root("deer");
	AddLayer2Root("defeat");
	AddLayer2Root("defence defense");
	AddLayer2Root("defend");
	AddLayer2Root("definite definitely");
	AddLayer2Root("delay");
	AddLayer2Root("deliberate deliberately");
	AddLayer2Root("delicate");
	AddLayer2Root("delight");
	AddLayer2Root("demand");
	AddLayer2Root("department");
	AddLayer2Root("depend");
	AddLayer2Root("dependent");
	AddLayer2Root("depth");
	AddLayer2Root("descend");
	AddLayer2Root("desert");
	AddLayer2Root("design");
	AddLayer2Root("desirable");
	AddLayer2Root("desire");
	AddLayer2Root("desk");
	AddLayer2Root("destroy");
	AddLayer2Root("destruction");
	AddLayer2Root("determination");
	AddLayer2Root("determined");
	AddLayer2Root("develop");
	AddLayer2Root("devil");
	AddLayer2Root("diamond");
	AddLayer2Root("dictionary");
	AddLayer2Root("difference");
	AddLayer2Root("difficulty");
	AddLayer2Root("dinner");
	AddLayer2Root("dip");
	AddLayer2Root("dirt");
	AddLayer2Root("dirty");
	AddLayer2Root("disappoint");
	AddLayer2Root("disappointing");
	AddLayer2Root("discourage");
	AddLayer2Root("discouragement");
	AddLayer2Root("discover");
	AddLayer2Root("discovery");
	AddLayer2Root("discuss");
	AddLayer2Root("discussion");
	AddLayer2Root("dish");
	AddLayer2Root("dismiss");
	AddLayer2Root("distant");
	AddLayer2Root("ditch");
	AddLayer2Root("document");
	AddLayer2Root("door");
	AddLayer2Root("doorway");
	AddLayer2Root("dot");
	AddLayer2Root("double");
	AddLayer2Root("doubt");
	AddLayer2Root("drag");
	AddLayer2Root("drawer");
	AddLayer2Root("dream dreamt");
	AddLayer2Root("dress");
	AddLayer2Root("drive drove driven");
	AddLayer2Root("drown");
	AddLayer2Root("drug");
	AddLayer2Root("drum");
	AddLayer2Root("duck");
	AddLayer2Root("dull");
	AddLayer2Root("dust");
	AddLayer2Root("duty");
	AddLayer2Root("eager");
	AddLayer2Root("early");
	AddLayer2Root("earn");
	AddLayer2Root("earth");
	AddLayer2Root("east");
	AddLayer2Root("eastern");
	AddLayer2Root("economic");
	AddLayer2Root("educate");
	AddLayer2Root("educated");
	AddLayer2Root("education");
	AddLayer2Root("effort");
	AddLayer2Root("eighth");
	AddLayer2Root("either");
	AddLayer2Root("elastic");
	AddLayer2Root("elbow");
	AddLayer2Root("electric");
	AddLayer2Root("electronic");
	AddLayer2Root("elephant");
	AddLayer2Root("embarrass");
	AddLayer2Root("embarrassing");
	AddLayer2Root("emotion");
	AddLayer2Root("emphasize");
	AddLayer2Root("employ");
	AddLayer2Root("employer");
	AddLayer2Root("employment");
	AddLayer2Root("empty");
	AddLayer2Root("enclose");
	AddLayer2Root("enclosure");
	AddLayer2Root("encourage");
	AddLayer2Root("encouragement");
	AddLayer2Root("enemy");
	AddLayer2Root("energy");
	AddLayer2Root("engine");
	AddLayer2Root("engineer");
	AddLayer2Root("English");
	AddLayer2Root("enjoyable");
	AddLayer2Root("enjoyment");
	AddLayer2Root("enter");
	AddLayer2Root("entrance");
	AddLayer2Root("envelope");
	AddLayer2Root("environment");
	AddLayer2Root("equal");
	AddLayer2Root("equality");
	AddLayer2Root("equipment");
	AddLayer2Root("escape");
	AddLayer2Root("establish");
	AddLayer2Root("establishment");
	AddLayer2Root("evening");
	AddLayer2Root("event");
	AddLayer2Root("ever");
	AddLayer2Root("everybody");
	AddLayer2Root("everyone");
	AddLayer2Root("everything");
	AddLayer2Root("everywhere");
	AddLayer2Root("evil");
	AddLayer2Root("examination");
	AddLayer2Root("examine");
	AddLayer2Root("example");
	AddLayer2Root("excellent");
	AddLayer2Root("excuse");
	AddLayer2Root("exercise");
	AddLayer2Root("existence");
	AddLayer2Root("expensive");
	AddLayer2Root("experience");
	AddLayer2Root("express");
	AddLayer2Root("expression");
	AddLayer2Root("extreme extremely");
	AddLayer2Root("eyelid");
	AddLayer2Root("fact");
	AddLayer2Root("factory");
	AddLayer2Root("faint");
	AddLayer2Root("fair");
	AddLayer2Root("fairly");
	AddLayer2Root("fairy");
	AddLayer2Root("faith");
	AddLayer2Root("faithful");
	AddLayer2Root("false");
	AddLayer2Root("fame");
	AddLayer2Root("familiar");
	AddLayer2Root("famous");
	AddLayer2Root("fancy");
	AddLayer2Root("farm");
	AddLayer2Root("farmer");
	AddLayer2Root("farmyard");
	AddLayer2Root("fashion");
	AddLayer2Root("fashionable");
	AddLayer2Root("fate");
	AddLayer2Root("father");
	AddLayer2Root("fault");
	AddLayer2Root("favour favor");
	AddLayer2Root("favourable favorable");
	AddLayer2Root("favourite favorite");
	AddLayer2Root("feather");
	AddLayer2Root("feature");
	AddLayer2Root("feed fed");
	AddLayer2Root("fellow");
	AddLayer2Root("fence");
	AddLayer2Root("fever");
	AddLayer2Root("few");
	AddLayer2Root("field");
	AddLayer2Root("fierce");
	AddLayer2Root("fifth");
	AddLayer2Root("figure");
	AddLayer2Root("fill");
	AddLayer2Root("film");
	AddLayer2Root("final");
	AddLayer2Root("finally");
	AddLayer2Root("financial");
	AddLayer2Root("find_out found_out");
	AddLayer2Root("fine");
	AddLayer2Root("finish");
	AddLayer2Root("firm");
	AddLayer2Root("fisherman fishermen");
	AddLayer2Root("fit");
	AddLayer2Root("fix");
	AddLayer2Root("flag");
	AddLayer2Root("flame");
	AddLayer2Root("flash");
	AddLayer2Root("flesh");
	AddLayer2Root("flight");
	AddLayer2Root("float");
	AddLayer2Root("flood");
	AddLayer2Root("fold");
	AddLayer2Root("fond");
	AddLayer2Root("football");
	AddLayer2Root("footpath");
	AddLayer2Root("footstep");
	AddLayer2Root("forbid forbade forbidden");
	AddLayer2Root("forehead");
	AddLayer2Root("foreign");
	AddLayer2Root("foreigner");
	AddLayer2Root("forest");
	AddLayer2Root("forget forgot forgotten");
	AddLayer2Root("forgive forgave forgiven");
	AddLayer2Root("fork");
	AddLayer2Root("former formerly");
	AddLayer2Root("fort");
	AddLayer2Root("fortunate");
	AddLayer2Root("fortune");
	AddLayer2Root("forward forwards");
	AddLayer2Root("fourth");
	AddLayer2Root("fox");
	AddLayer2Root("frame");
	AddLayer2Root("free");
	AddLayer2Root("freedom");
	AddLayer2Root("freeze froze frozen");
	AddLayer2Root("frequent");
	AddLayer2Root("fresh");
	AddLayer2Root("frighten");
	AddLayer2Root("frightening");
	AddLayer2Root("fulfil fulfill");
	AddLayer2Root("full");
	AddLayer2Root("fun");
	AddLayer2Root("furnish");
	AddLayer2Root("furniture");
	AddLayer2Root("further");
	AddLayer2Root("future");
	AddLayer2Root("gain");
	AddLayer2Root("garage");
	AddLayer2Root("garden");
	AddLayer2Root("garment");
	AddLayer2Root("gate");
	AddLayer2Root("gather");
	AddLayer2Root("general generally");
	AddLayer2Root("generous");
	AddLayer2Root("gentleman gentlemen");
	AddLayer2Root("gift");
	AddLayer2Root("girl");
	AddLayer2Root("glad");
	AddLayer2Root("glass");
	AddLayer2Root("glory");
	AddLayer2Root("goat");
	AddLayer2Root("gold");
	AddLayer2Root("golden");
	AddLayer2Root("goodbye");
	AddLayer2Root("goods");
	AddLayer2Root("grace");
	AddLayer2Root("graceful");
	AddLayer2Root("gradual");
	AddLayer2Root("grammar");
	AddLayer2Root("grand");
	AddLayer2Root("grandfather");
	AddLayer2Root("grandmother");
	AddLayer2Root("grandparent");
	AddLayer2Root("grass");
	AddLayer2Root("grateful");
	AddLayer2Root("grave");
	AddLayer2Root("greet");
	AddLayer2Root("greeting");
	AddLayer2Root("grey gray");
	AddLayer2Root("grief");
	AddLayer2Root("grieve");
	AddLayer2Root("growth");
	AddLayer2Root("guard");
	AddLayer2Root("guess");
	AddLayer2Root("guest");
	AddLayer2Root("guidance");
	AddLayer2Root("guide");
	AddLayer2Root("guilt");
	AddLayer2Root("guilty");
	AddLayer2Root("habit");
	AddLayer2Root("habitual");
	AddLayer2Root("hairy");
	AddLayer2Root("hall");
	AddLayer2Root("hammer");
	AddLayer2Root("handkerchief");
	AddLayer2Root("hang hung hanged");
	AddLayer2Root("harden");
	AddLayer2Root("hardly");
	AddLayer2Root("hardship");
	AddLayer2Root("hasty");
	AddLayer2Root("hat");
	AddLayer2Root("hate");
	AddLayer2Root("hatred");
	AddLayer2Root("health");
	AddLayer2Root("heart");
	AddLayer2Root("heaven");
	AddLayer2Root("heel");
	AddLayer2Root("helpful");
	AddLayer2Root("hen");
	AddLayer2Root("hers");
	AddLayer2Root("herself");
	AddLayer2Root("hide hid hidden");
	AddLayer2Root("hill");
	AddLayer2Root("himself");
	AddLayer2Root("hire");
	AddLayer2Root("historical");
	AddLayer2Root("history");
	AddLayer2Root("holiday");
	AddLayer2Root("hollow");
	AddLayer2Root("holy");
	AddLayer2Root("honour honor");
	AddLayer2Root("honourable honorable");
	AddLayer2Root("hook");
	AddLayer2Root("hope");
	AddLayer2Root("hopeful");
	AddLayer2Root("hopeless");
	AddLayer2Root("horizon");
	AddLayer2Root("horn");
	AddLayer2Root("horse");
	AddLayer2Root("hospital");
	AddLayer2Root("host");
	AddLayer2Root("hotel");
	AddLayer2Root("hourly");
	AddLayer2Root("human");
	AddLayer2Root("humorous");
	AddLayer2Root("humour humor");
	AddLayer2Root("hundredth");
	AddLayer2Root("hunger");
	AddLayer2Root("hungry");
	AddLayer2Root("hunt");
	AddLayer2Root("hurry");
	AddLayer2Root("husband");
	AddLayer2Root("hut");
	AddLayer2Root("ice");
	AddLayer2Root("icy");
	AddLayer2Root("idea");
	AddLayer2Root("ignore");
	AddLayer2Root("illegal");
	AddLayer2Root("image");
	AddLayer2Root("imaginary");
	AddLayer2Root("imagination");
	AddLayer2Root("imagine");
	AddLayer2Root("importance");
	AddLayer2Root("impressive");
	AddLayer2Root("improve");
	AddLayer2Root("improvement");
	AddLayer2Root("in_spite_of");
	AddLayer2Root("include");
	AddLayer2Root("including");
	AddLayer2Root("income");
	AddLayer2Root("independent");
	AddLayer2Root("indoor");
	AddLayer2Root("indoors");
	AddLayer2Root("industrial");
	AddLayer2Root("industry");
	AddLayer2Root("infect");
	AddLayer2Root("infection");
	AddLayer2Root("infectious");
	AddLayer2Root("influence");
	AddLayer2Root("influential");
	AddLayer2Root("injure");
	AddLayer2Root("injury");
	AddLayer2Root("ink");
	AddLayer2Root("inner");
	AddLayer2Root("inquire");
	AddLayer2Root("inquiry");
	AddLayer2Root("instead");
	AddLayer2Root("institution");
	AddLayer2Root("instruct");
	AddLayer2Root("instruction");
	AddLayer2Root("instrument");
	AddLayer2Root("insult");
	AddLayer2Root("insulting");
	AddLayer2Root("insurance");
	AddLayer2Root("insure");
	AddLayer2Root("intelligence");
	AddLayer2Root("intelligent");
	AddLayer2Root("intend");
	AddLayer2Root("intention");
	AddLayer2Root("interest");
	AddLayer2Root("interesting");
	AddLayer2Root("international");
	AddLayer2Root("interrupt");
	AddLayer2Root("introduce");
	AddLayer2Root("introduction");
	AddLayer2Root("invent");
	AddLayer2Root("invention");
	AddLayer2Root("invitation");
	AddLayer2Root("invite");
	AddLayer2Root("involve");
	AddLayer2Root("inwards");
	AddLayer2Root("iron");
	AddLayer2Root("island");
	AddLayer2Root("itself");
	AddLayer2Root("jaw");
	AddLayer2Root("jealous");
	AddLayer2Root("jealousy");
	AddLayer2Root("jelly");
	AddLayer2Root("job");
	AddLayer2Root("joint");
	AddLayer2Root("joke");
	AddLayer2Root("journey");
	AddLayer2Root("joy");
	AddLayer2Root("judge");
	AddLayer2Root("judgment");
	AddLayer2Root("jump");
	AddLayer2Root("justice");
	AddLayer2Root("keen");
	AddLayer2Root("key");
	AddLayer2Root("kick");
	AddLayer2Root("kilo");
	AddLayer2Root("kiss");
	AddLayer2Root("kitchen");
	AddLayer2Root("knock");
	AddLayer2Root("knot");
	AddLayer2Root("knowledge");
	AddLayer2Root("labour labor");
	AddLayer2Root("lack");
	AddLayer2Root("ladder");
	AddLayer2Root("lady");
	AddLayer2Root("lake");
	AddLayer2Root("lamb");
	AddLayer2Root("lamp");
	AddLayer2Root("late");
	AddLayer2Root("lately");
	AddLayer2Root("laughter");
	AddLayer2Root("lawyer");
	AddLayer2Root("lay laid");
	AddLayer2Root("layer");
	AddLayer2Root("lazy");
	AddLayer2Root("lean");
	AddLayer2Root("least");
	AddLayer2Root("leather");
	AddLayer2Root("lend lent");
	AddLayer2Root("let");
	AddLayer2Root("let_go_of");
	AddLayer2Root("level");
	AddLayer2Root("library");
	AddLayer2Root("lid");
	AddLayer2Root("lie lying lied lay lain");
	AddLayer2Root("lie_down lying_down lay_down lain_down");
	AddLayer2Root("lightning");
	AddLayer2Root("limit");
	AddLayer2Root("lion");
	AddLayer2Root("list");
	AddLayer2Root("listen");
	AddLayer2Root("load");
	AddLayer2Root("loaf loaves");
	AddLayer2Root("local");
	AddLayer2Root("lock");
	AddLayer2Root("lodging lodgings");
	AddLayer2Root("log");
	AddLayer2Root("lonely");
	AddLayer2Root("look_after");
	AddLayer2Root("look_for");
	AddLayer2Root("look_up");
	AddLayer2Root("loose");
	AddLayer2Root("lord");
	AddLayer2Root("lose lost");
	AddLayer2Root("loss");
	AddLayer2Root("lot");
	AddLayer1Root("lower");
	AddLayer2Root("loyal");
	AddLayer2Root("loyalty");
	AddLayer2Root("luck");
	AddLayer2Root("lucky");
	AddLayer2Root("lump");
	AddLayer2Root("lung");
	AddLayer2Root("machinery");
	AddLayer2Root("mad");
	AddLayer2Root("magazine");
	AddLayer2Root("mail");
	AddLayer2Root("make_into made_into");
	AddLayer2Root("make_up made_up");
	AddLayer2Root("manage");
	AddLayer2Root("manager");
	AddLayer2Root("manner");
	AddLayer2Root("map");
	AddLayer2Root("march");
	AddLayer2Root("market");
	AddLayer2Root("marriage");
	AddLayer2Root("mass");
	AddLayer2Root("master");
	AddLayer2Root("mat");
	AddLayer2Root("match");
	AddLayer2Root("mathematics");
	AddLayer2Root("meal");
	AddLayer2Root("measurement");
	AddLayer2Root("medical");
	AddLayer2Root("medicine");
	AddLayer2Root("member");
	AddLayer2Root("memory");
	AddLayer2Root("mend");
	AddLayer2Root("mental");
	AddLayer2Root("mention");
	AddLayer2Root("merry");
	AddLayer2Root("message");
	AddLayer2Root("messenger");
	AddLayer2Root("method");
	AddLayer2Root("metric");
	AddLayer2Root("microscope");
	AddLayer2Root("million");
	AddLayer2Root("millionth");
	AddLayer2Root("mine");
	AddLayer2Root("mineral");
	AddLayer2Root("minister");
	AddLayer2Root("mirror");
	AddLayer2Root("miss");
	AddLayer2Root("mist");
	AddLayer2Root("mistake");
	AddLayer2Root("modern");
	AddLayer2Root("monkey");
	AddLayer2Root("monthly");
	AddLayer2Root("moon");
	AddLayer2Root("moral");
	AddLayer2Root("morals");
	AddLayer2Root("morning");
	AddLayer2Root("mountain");
	AddLayer2Root("mouse mice");
	AddLayer2Root("mud");
	AddLayer2Root("murder");
	AddLayer2Root("muscle");
	AddLayer2Root("musician");
	AddLayer2Root("myself");
	AddLayer2Root("mysterious");
	AddLayer2Root("mystery");
	AddLayer2Root("nail");
	AddLayer2Root("nasty");
	AddLayer2Root("natural");
	AddLayer2Root("nature");
	AddLayer2Root("nearly");
	AddLayer2Root("necessary");
	AddLayer2Root("needle");
	AddLayer2Root("negative");
	AddLayer2Root("neighbour neighbor");
	AddLayer2Root("neighbourhood neighborhood");
	AddLayer2Root("neither");
	AddLayer2Root("nerve");
	AddLayer2Root("nervous");
	AddLayer2Root("nest");
	AddLayer2Root("net");
	AddLayer2Root("network");
	AddLayer2Root("never");
	AddLayer2Root("news");
	AddLayer2Root("newspaper");
	AddLayer2Root("next");
	AddLayer2Root("nice");
	AddLayer2Root("ninth");
	AddLayer2Root("no_one");
	AddLayer2Root("none");
	AddLayer2Root("nonsense");
	AddLayer2Root("nor");
	AddLayer2Root("normal");
	AddLayer2Root("north");
	AddLayer2Root("northern");
	AddLayer2Root("nowhere");
	AddLayer2Root("nurse");
	AddLayer2Root("nut");
	AddLayer2Root("nylon");
	AddLayer2Root("o'clock");
	AddLayer2Root("obtain");
	AddLayer2Root("ocean");
	AddLayer2Root("odd");
	AddLayer2Root("offence offense");
	AddLayer2Root("offend");
	AddLayer2Root("offensive");
	AddLayer2Root("offer");
	AddLayer2Root("office");
	AddLayer2Root("officer");
	AddLayer2Root("official");
	AddLayer2Root("oil");
	AddLayer2Root("old-fashioned");
	AddLayer2Root("once");
	AddLayer2Root("onion");
	AddLayer2Root("only_just");
	AddLayer2Root("open");
	AddLayer2Root("operate");
	AddLayer2Root("operation");
	AddLayer2Root("opinion");
	AddLayer2Root("opponent");
	AddLayer2Root("opportunity");
	AddLayer2Root("oppose");
	AddLayer2Root("opposite");
	AddLayer2Root("opposition");
	AddLayer2Root("orange");
	AddLayer2Root("ordinary");
	AddLayer2Root("organ");
	AddLayer2Root("origin");
	AddLayer2Root("original");
	AddLayer2Root("otherwise");
	AddLayer2Root("ought");
	AddLayer2Root("our ours");
	AddLayer2Root("ourselves");
	AddLayer2Root("outdoor");
	AddLayer2Root("outdoors");
	AddLayer2Root("pack");
	AddLayer2Root("package");
	AddLayer2Root("packet");
	AddLayer2Root("page");
	AddLayer2Root("pair");
	AddLayer2Root("pale");
	AddLayer2Root("pan");
	AddLayer2Root("parallel");
	AddLayer2Root("parcel");
	AddLayer2Root("park");
	AddLayer2Root("parliament");
	AddLayer2Root("partly");
	AddLayer2Root("partner");
	AddLayer2Root("party");
	AddLayer2Root("pass");
	AddLayer2Root("passage");
	AddLayer2Root("passenger");
	AddLayer2Root("past");
	AddLayer2Root("pastry");
	AddLayer2Root("patience");
	AddLayer2Root("patient");
	AddLayer2Root("pause");
	AddLayer2Root("peace");
	AddLayer2Root("peaceful");
	AddLayer2Root("pen");
	AddLayer2Root("pencil");
	AddLayer2Root("pepper");
	AddLayer2Root("per");
	AddLayer2Root("per_cent percent");
	AddLayer2Root("perfect");
	AddLayer2Root("perform");
	AddLayer2Root("performance");
	AddLayer2Root("perhaps");
	AddLayer2Root("permanent");
	AddLayer2Root("permission");
	AddLayer2Root("permit");
	AddLayer2Root("personal");
	AddLayer2Root("persuade");
	AddLayer2Root("pet");
	AddLayer2Root("petrol");
	AddLayer2Root("physical");
	AddLayer2Root("piano");
	AddLayer2Root("pick");
	AddLayer2Root("pick_up");
	AddLayer2Root("pig");
	AddLayer2Root("pile");
	AddLayer2Root("pilot");
	AddLayer2Root("pin");
	AddLayer2Root("pink");
	AddLayer2Root("pipe");
	AddLayer2Root("pity");
	AddLayer2Root("plain");
	AddLayer2Root("plane");
	AddLayer2Root("plastic");
	AddLayer2Root("plate");
	AddLayer2Root("pleasure");
	AddLayer2Root("plenty");
	AddLayer2Root("plural");
	AddLayer2Root("pocket");
	AddLayer2Root("poem");
	AddLayer2Root("poet");
	AddLayer2Root("poetry");
	AddLayer2Root("poison");
	AddLayer2Root("poisonous");
	AddLayer2Root("polish");
	AddLayer2Root("polite");
	AddLayer2Root("political");
	AddLayer2Root("politician");
	AddLayer2Root("politics");
	AddLayer2Root("pool");
	AddLayer2Root("popular");
	AddLayer2Root("popularity");
	AddLayer2Root("population");
	AddLayer2Root("port");
	AddLayer2Root("positive");
	AddLayer2Root("possess");
	AddLayer2Root("possession");
	AddLayer2Root("possibility");
	AddLayer2Root("possible");
	AddLayer2Root("possibly");
	AddLayer2Root("post");
	AddLayer2Root("pot");
	AddLayer2Root("potato");
	AddLayer2Root("pour");
	AddLayer2Root("practical");
	AddLayer2Root("practice practise");
	AddLayer2Root("praise");
	AddLayer2Root("pray");
	AddLayer2Root("prayer");
	AddLayer2Root("precious");
	AddLayer2Root("prefer");
	AddLayer2Root("presence");
	AddLayer2Root("present");
	AddLayer2Root("preserve");
	AddLayer2Root("president");
	AddLayer2Root("pressure");
	AddLayer2Root("pretend");
	AddLayer2Root("pretty");
	AddLayer2Root("previous");
	AddLayer2Root("price");
	AddLayer2Root("prickly");
	AddLayer2Root("pride");
	AddLayer2Root("principle");
	AddLayer2Root("prison");
	AddLayer2Root("prisoner");
	AddLayer2Root("private");
	AddLayer2Root("prize");
	AddLayer2Root("probability");
	AddLayer2Root("probably");
	AddLayer2Root("problem");
	AddLayer2Root("process");
	AddLayer2Root("profession");
	AddLayer2Root("profit");
	AddLayer2Root("programme program");
	AddLayer2Root("progress");
	AddLayer2Root("pronounce");
	AddLayer2Root("pronunciation");
	AddLayer2Root("proof");
	AddLayer2Root("proper");
	AddLayer2Root("property");
	AddLayer2Root("proposal");
	AddLayer2Root("protest");
	AddLayer2Root("proud");
	AddLayer2Root("prove proven");
	AddLayer2Root("public");
	AddLayer2Root("pump");
	AddLayer2Root("pupil");
	AddLayer2Root("pure");
	AddLayer2Root("purple");
	AddLayer2Root("quantity");
	AddLayer2Root("quarrel");
	AddLayer2Root("quarter");
	AddLayer2Root("quite");
	AddLayer2Root("rabbit");
	AddLayer2Root("race");
	AddLayer2Root("railway");
	AddLayer2Root("raise");
	AddLayer2Root("range");
	AddLayer2Root("rank");
	AddLayer2Root("rapid");
	AddLayer2Root("rat");
	AddLayer2Root("rather");
	AddLayer2Root("raw");
	AddLayer2Root("reach");
	AddLayer2Root("react");
	AddLayer2Root("reaction");
	AddLayer2Root("ready");
	AddLayer2Root("real");
	AddLayer2Root("realize");
	AddLayer2Root("really");
	AddLayer2Root("recent");
	AddLayer2Root("recently");
	AddLayer2Root("recognition");
	AddLayer2Root("recognize");
	AddLayer2Root("record");
	AddLayer2Root("reduce");
	AddLayer2Root("reduction");
	AddLayer2Root("refusal");
	AddLayer2Root("refuse");
	AddLayer2Root("regard");
	AddLayer2Root("regular");
	AddLayer2Root("related");
	AddLayer2Root("relation");
	AddLayer2Root("relationship");
	AddLayer2Root("relative");
	AddLayer2Root("relax");
	AddLayer2Root("relaxing");
	AddLayer2Root("religion");
	AddLayer2Root("religious");
	AddLayer2Root("remain");
	AddLayer2Root("remark");
	AddLayer2Root("remind");
	AddLayer2Root("rent");
	AddLayer2Root("repeat");
	AddLayer2Root("replace");
	AddLayer2Root("reply");
	AddLayer2Root("report");
	AddLayer2Root("request");
	AddLayer2Root("respect");
	AddLayer2Root("respectful");
	AddLayer2Root("responsible");
	AddLayer2Root("rest");
	AddLayer2Root("restaurant");
	AddLayer2Root("restrict");
	AddLayer2Root("return");
	AddLayer2Root("reward");
	AddLayer2Root("rice");
	AddLayer2Root("rich");
	AddLayer2Root("rid rid_of");
	AddLayer2Root("ring");
	AddLayer2Root("ripe");
	AddLayer2Root("rise rose risen");
	AddLayer2Root("risk");
	AddLayer2Root("river");
	AddLayer2Root("road");
	AddLayer2Root("rob");
	AddLayer2Root("rod");
	AddLayer2Root("roll");
	AddLayer2Root("romantic");
	AddLayer2Root("roof");
	AddLayer2Root("root");
	AddLayer2Root("rose");
	AddLayer2Root("rough");
	AddLayer2Root("row");
	AddLayer2Root("rubber");
	AddLayer2Root("rude");
	AddLayer2Root("ruin");
	AddLayer2Root("ruler");
	AddLayer2Root("rush");
	AddLayer2Root("safe");
	AddLayer2Root("safety");
	AddLayer2Root("sail");
	AddLayer2Root("sale");
	AddLayer2Root("sand");
	AddLayer2Root("save");
	AddLayer2Root("scatter");
	AddLayer2Root("scene");
	AddLayer2Root("scenery");
	AddLayer2Root("science");
	AddLayer2Root("scientific");
	AddLayer2Root("scientist");
	AddLayer2Root("scissors");
	AddLayer2Root("screen");
	AddLayer2Root("screw");
	AddLayer2Root("sea");
	AddLayer2Root("search");
	AddLayer2Root("season");
	AddLayer2Root("seat");
	AddLayer2Root("secrecy");
	AddLayer2Root("secret");
	AddLayer2Root("secretary");
	AddLayer2Root("seem");
	AddLayer2Root("seize");
	AddLayer2Root("sensation");
	AddLayer2Root("series");
	AddLayer2Root("serious");
	AddLayer2Root("servant");
	AddLayer2Root("serve");
	AddLayer2Root("service");
	AddLayer2Root("settle");
	AddLayer2Root("seventh");
	AddLayer2Root("severe");
	AddLayer2Root("sew sewn");
	AddLayer2Root("sex");
	AddLayer2Root("shade");
	AddLayer2Root("shadow");
	AddLayer2Root("shake shook shaken");
	AddLayer2Root("shall");
	AddLayer2Root("shame");
	AddLayer2Root("share");
	AddLayer2Root("sheet");
	AddLayer2Root("shelf shelves");
	AddLayer2Root("shell");
	AddLayer2Root("shelter");
	AddLayer2Root("shield");
	AddLayer2Root("ship");
	AddLayer2Root("shirt");
	AddLayer2Root("shock");
	AddLayer2Root("shocking");
	AddLayer2Root("shoe");
	AddLayer2Root("shop");
	AddLayer2Root("shopkeeper");
	AddLayer2Root("shore");
	AddLayer2Root("should");
	AddLayer2Root("shoulder");
	AddLayer2Root("shout");
	AddLayer2Root("shut");
	AddLayer2Root("shy");
	AddLayer2Root("sideways");
	AddLayer2Root("sight");
	AddLayer2Root("sign");
	AddLayer2Root("signature");
	AddLayer2Root("silence");
	AddLayer2Root("silent");
	AddLayer2Root("silk");
	AddLayer2Root("silly");
	AddLayer2Root("silver");
	AddLayer2Root("similarity");
	AddLayer2Root("simple");
	AddLayer2Root("since");
	AddLayer2Root("sincere");
	AddLayer2Root("sing sang sung");
	AddLayer2Root("single");
	AddLayer2Root("singular");
	AddLayer2Root("sink sank sunk");
	AddLayer2Root("sister");
	AddLayer2Root("situation");
	AddLayer2Root("sixth");
	AddLayer2Root("skirt");
	AddLayer2Root("slave");
	AddLayer2Root("slight");
	AddLayer2Root("slip");
	AddLayer2Root("slippery");
	AddLayer2Root("slow");
	AddLayer2Root("smile");
	AddLayer2Root("snake");
	AddLayer2Root("snow");
	AddLayer2Root("soap");
	AddLayer2Root("social");
	AddLayer2Root("society");
	AddLayer2Root("sock");
	AddLayer2Root("solemn");
	AddLayer2Root("solution");
	AddLayer2Root("solve");
	AddLayer2Root("somebody");
	AddLayer2Root("somehow");
	AddLayer2Root("sometimes");
	AddLayer2Root("somewhere");
	AddLayer2Root("son");
	AddLayer2Root("song");
	AddLayer2Root("soon");
	AddLayer2Root("sore");
	AddLayer2Root("sorrow");
	AddLayer2Root("sort");
	AddLayer2Root("soul");
	AddLayer2Root("soup");
	AddLayer2Root("south");
	AddLayer2Root("southern");
	AddLayer2Root("spade");
	AddLayer2Root("speak spoke spoken");
	AddLayer2Root("spear");
	AddLayer2Root("specific");
	AddLayer2Root("speech");
	AddLayer2Root("speed");
	AddLayer2Root("spell spelt");
	AddLayer2Root("spend spent");
	AddLayer2Root("spin spun");
	AddLayer2Root("spirit");
	AddLayer2Root("spite");
	AddLayer2Root("splendid");
	AddLayer2Root("split");
	AddLayer2Root("spoil spoilt");
	AddLayer2Root("spoon");
	AddLayer2Root("spot");
	AddLayer2Root("spread");
	AddLayer2Root("spring sprang sprung");
	AddLayer2Root("stage");
	AddLayer2Root("stair");
	AddLayer2Root("stamp");
	AddLayer2Root("stand stood");
	AddLayer2Root("standard");
	AddLayer2Root("star");
	AddLayer2Root("steady");
	AddLayer2Root("steal stole stolen");
	AddLayer2Root("steam");
	AddLayer2Root("steel");
	AddLayer2Root("steep");
	AddLayer2Root("stem");
	AddLayer2Root("step");
	AddLayer2Root("stick stuck");
	AddLayer2Root("sticky");
	AddLayer2Root("still");
	AddLayer2Root("sting stung");
	AddLayer2Root("stitch");
	AddLayer2Root("store");
	AddLayer2Root("storm");
	AddLayer2Root("strange");
	AddLayer2Root("stranger");
	AddLayer2Root("stream");
	AddLayer2Root("street");
	AddLayer2Root("strength");
	AddLayer2Root("stretch");
	AddLayer2Root("strict");
	AddLayer2Root("strike struck");
	AddLayer2Root("stroke");
	AddLayer2Root("structure");
	AddLayer2Root("struggle");
	AddLayer2Root("stupid");
	AddLayer2Root("style");
	AddLayer2Root("substance");
	AddLayer2Root("subtract");
	AddLayer2Root("suck");
	AddLayer2Root("suffer");
	AddLayer2Root("sugar");
	AddLayer2Root("suggest");
	AddLayer2Root("suit");
	AddLayer2Root("suitable");
	AddLayer2Root("summer");
	AddLayer2Root("supper");
	AddLayer2Root("supply");
	AddLayer2Root("support");
	AddLayer2Root("suppose");
	AddLayer2Root("sure");
	AddLayer2Root("surprise");
	AddLayer2Root("surprising");
	AddLayer2Root("surround");
	AddLayer2Root("swallow");
	AddLayer2Root("swear swore sworn");
	AddLayer2Root("sweep swept");
	AddLayer2Root("swell swollen");
	AddLayer2Root("swim swam swum");
	AddLayer2Root("swing swung");
	AddLayer2Root("sword");
	AddLayer2Root("sympathetic");
	AddLayer2Root("sympathy");
	AddLayer2Root("system");
	AddLayer2Root("tax");
	AddLayer2Root("taxi");
	AddLayer2Root("tea");
	AddLayer2Root("tear tore torn");
	AddLayer2Root("telephone");
	AddLayer2Root("temper");
	AddLayer2Root("temple");
	AddLayer2Root("temporary");
	AddLayer2Root("tend");
	AddLayer2Root("tendency");
	AddLayer2Root("tender");
	AddLayer2Root("tennis");
	AddLayer2Root("tense");
	AddLayer2Root("tent");
	AddLayer2Root("terrible");
	AddLayer2Root("terror");
	AddLayer2Root("test");
	AddLayer2Root("theatre theater");
	AddLayer2Root("theirs");
	AddLayer2Root("themselves");
	AddLayer2Root("therefore");
	AddLayer2Root("thief thieves");
	AddLayer2Root("third");
	AddLayer2Root("thirst");
	AddLayer2Root("thirsty");
	AddLayer2Root("thorough");
	AddLayer2Root("though");
	AddLayer2Root("thousandth");
	AddLayer2Root("threat");
	AddLayer2Root("threaten");
	AddLayer2Root("threatening");
	AddLayer2Root("throat");
	AddLayer2Root("throw threw thrown");
	AddLayer2Root("thumb");
	AddLayer2Root("thunder");
	AddLayer2Root("thus");
	AddLayer2Root("ticket");
	AddLayer2Root("tidy");
	AddLayer2Root("tie tying");
	AddLayer2Root("tiger");
	AddLayer2Root("tight");
	AddLayer2Root("timetable");
	AddLayer2Root("tin");
	AddLayer2Root("tire");
	AddLayer2Root("tired");
	AddLayer2Root("tiring");
	AddLayer2Root("title");
	AddLayer2Root("tobacco");
	AddLayer2Root("today");
	AddLayer2Root("toe");
	AddLayer2Root("tomorrow");
	AddLayer2Root("tonight");
	AddLayer2Root("tour");
	AddLayer2Root("tourist");
	AddLayer2Root("tower");
	AddLayer2Root("town");
	AddLayer2Root("toy");
	AddLayer2Root("track");
	AddLayer2Root("trade");
	AddLayer2Root("traditional");
	AddLayer2Root("traffic");
	AddLayer2Root("train");
	AddLayer2Root("training");
	AddLayer2Root("translate");
	AddLayer2Root("transparent");
	AddLayer2Root("trap");
	AddLayer2Root("treat");
	AddLayer2Root("treatment");
	AddLayer2Root("tremble");
	AddLayer2Root("tribe");
	AddLayer2Root("trick");
	AddLayer2Root("trip");
	AddLayer2Root("tropical");
	AddLayer2Root("trouble");
	AddLayer2Root("trousers");
	AddLayer2Root("trunk");
	AddLayer2Root("trust");
	AddLayer2Root("truth");
	AddLayer2Root("tune");
	AddLayer2Root("twice");
	AddLayer2Root("typical");
	AddLayer2Root("tyre tire");
	AddLayer2Root("ugly");
	AddLayer2Root("uncle");
	AddLayer2Root("underwear");
	AddLayer2Root("undo undoes undid undone");
	AddLayer2Root("unexpected");
	AddLayer2Root("uniform");
	AddLayer2Root("union");
	AddLayer2Root("unite");
	AddLayer2Root("universal");
	AddLayer2Root("universe");
	AddLayer2Root("university");
	AddLayer2Root("unless");
	AddLayer2Root("unusual");
	AddLayer2Root("upper");
	AddLayer2Root("upright");
	AddLayer2Root("upset");
	AddLayer2Root("upside upside_down");
	AddLayer2Root("upstairs");
	AddLayer2Root("urge");
	AddLayer2Root("urgent");
	AddLayer2Root("useless");
	AddLayer2Root("valley");
	AddLayer2Root("variety");
	AddLayer2Root("various");
	AddLayer2Root("vary");
	AddLayer2Root("vegetable");
	AddLayer2Root("victory");
	AddLayer2Root("view");
	AddLayer2Root("village");
	AddLayer2Root("violence");
	AddLayer2Root("violent");
	AddLayer2Root("visit");
	AddLayer2Root("voice");
	AddLayer2Root("vote");
	AddLayer2Root("vowel");
	AddLayer2Root("voyage");
	AddLayer2Root("wages");
	AddLayer2Root("wait");
	AddLayer2Root("waiter");
	AddLayer2Root("wake");
	AddLayer2Root("wall");
	AddLayer2Root("wander");
	AddLayer2Root("war");
	AddLayer2Root("warm");
	AddLayer2Root("warmth");
	AddLayer2Root("warn");
	AddLayer2Root("warning");
	AddLayer2Root("wash");
	AddLayer2Root("waste");
	AddLayer2Root("wave");
	AddLayer2Root("way");
	AddLayer2Root("wealth");
	AddLayer2Root("weapon");
	AddLayer2Root("weather");
	AddLayer2Root("weave wove woven");
	AddLayer2Root("weigh");
	AddLayer2Root("welcome");
	AddLayer2Root("west");
	AddLayer2Root("western");
	AddLayer2Root("wet");
	AddLayer2Root("wheat");
	AddLayer2Root("whether");
	AddLayer2Root("whip");
	AddLayer2Root("whisper");
	AddLayer2Root("whistle");
	AddLayer2Root("whole");
	AddLayer2Root("whose");
	AddLayer2Root("wicked");
	AddLayer2Root("widespread");
	AddLayer2Root("wife wives");
	AddLayer2Root("wild");
	AddLayer2Root("willing");
	AddLayer2Root("window");
	AddLayer2Root("wine");
	AddLayer2Root("wing");
	AddLayer2Root("winter");
	AddLayer2Root("wisdom");
	AddLayer2Root("wise");
	AddLayer2Root("wish");
	AddLayer2Root("within");
	AddLayer2Root("witness");
	AddLayer2Root("wonder");
	AddLayer2Root("wool");
	AddLayer2Root("woollen woolen");
	AddLayer2Root("world");
	AddLayer2Root("worm");
	AddLayer2Root("worse");
	AddLayer2Root("worship");
	AddLayer2Root("worst");
	AddLayer2Root("wrap");
	AddLayer2Root("wreck");
	AddLayer2Root("wrist");
	AddLayer2Root("wrong");
	AddLayer2Root("wrongdoing");
	AddLayer2Root("yearly");
	AddLayer2Root("yesterday");
	AddLayer2Root("yet");
	AddLayer2Root("yours");
	AddLayer2Root("yourself");
	AddLayer2Root("youth");
}

/**************************************************************************/


var ltwf = `non-
in-
re-
un-
dis-
ir-
im-
the
of
and
to
in
a
is
that
for
was
as
with
not
be
i
it
on
by
or
his
are
he
from
at
which
this
have
had
you
an
were
but
they
their
one
all
her
can
we
has
been
will
would
more
who
him
so
other
she
them
its
no
when
there
than
my
into
may
do
time
out
if
about
up
only
me
some
what
these
two
such
said
could
also
any
your
first
our
should
then
most
like
did
made
over
very
see
must
many
through
between
man
after
those
where
well
same
now
people
before
much
even
work
way
life
each
new
us
being
because
own
make
good
how
under
use
know
long
down
day
back
great
just
both
little
men
three
part
without
found
right
might
too
does
god
still
never
while
against
another
world
here
place
take
old
number
get
every
go
come
case
system
state
year
shall
during
off
say
given
high
small
water
again
came
different
power
children
few
form
hand
himself
less
large
left
thought
think
last
point
often
order
end
within
set
always
important
find
away
general
fact
until
though
present
need
give
among
example
since
public
home
far
second
name
course
around
went
family
law
side
women
per
head
want
body
put
best
social
four
possible
took
going
whole
something
country
group
house
become
several
information
above
rather
known
government
means
line
once
yet
better
human
am
value
certain
love
school
ever
seen
early
process
mind
young
change
person
light
taken
face
either
university
least
next
almost
nothing
done
business
war
child
control
look
room
enough
whether
told
common
death
itself
night
help
half
nature
political
book
got
interest
together
themselves
five
true
white
study
period
question
thing
full
father
whose
along
effect
let
matter
necessary
became
action
mother
sense
saw
result
kind
free
land
history
thus
subject
already
heart
woman
problem
money
city
word
held
open
age
began
knew
position
view
show
level
area
therefore
able
usually
tell
real
english
type
air
using
brought
various
care
whom
short
class
felt
gave
figure
service
experience
quite
reason
rate
particular
especially
support
low
really
century
near
feet
black
keep
shown
further
soon
cause
read
why
single
knowledge
field
force
moment
past
call
nor
believe
lord
feel
mean
blood
similar
heard
including
company
local
probably
party
clear
press
son
close
perhaps
special
amount
anything
door
court
wife
percent
language
program
idea
method
available
account
hard
sometimes
turn
story
although
act
six
natural
property
sure
ground
material
across
written
return
character
total
third
strong
surface
alone
personal
cost
economic
future
purpose
provide
education
behind
voice
play
society
lower
table
live
food
specific
rest
treatment
increase
sent
hundred
lost
church
attention
office
late
morning
letter
town
production
generally
health
difficult
front
south
art
size
poor
influence
energy
national
current
space
leave
simple
understand
doing
paper
below
structure
patient
practice
situation
seem
born
fire
plan
friend
model
run
pressure
include
except
according
test
truth
likely
complete
growth
outside
top
market
answer
ten
addition
north
condition
manner
pay
bring
private
earth
kept
beginning
appear
physical
population
movement
else
original
king
activity
disease
length
beyond
building
red
cut
related
behavior
object
hope
myself
hold
foreign
solution
president
series
equal
degree
sound
loss
wrote
relationship
note
rule
range
military
main
price
normal
difference
hear
respect
west
everything
organization
trade
labor
hour
deep
big
modern
dead
led
religious
report
nearly
direct
stood
page
ask
yes
gone
lead
income
job
dark
spirit
move
march
direction
fall
talk
herself
meet
music
presence
authority
sea
acid
average
meaning
design
fine
capital
decision
feeling
met
product
former
speak
bad
quality
follow
cent
tried
middle
stage
wide
distance
girl
boy
actually
paid
cell
importance
instead
eye
expression
determined
tax
standard
today
try
temperature
bed
performance
week
fear
final
produce
thousand
ready
faith
member
stand
arms
strength
consider
married
opinion
list
weight
lives
meeting
base
immediately
built
deal
easily
success
step
write
round
peace
cold
lot
road
color
center
effective
husband
date
proper
easy
doubt
industry
finally
training
soul
brother
pain
statement
lay
ago
oil
car
hair
forward
positive
discussion
heat
central
million
ability
remember
nation
moral
sort
wall
seven
basic
science
learn
eight
risk
operation
army
daughter
start
record
wish
die
mass
measure
charge
attempt
existence
picture
pass
sun
sat
student
effort
beautiful
river
image
flow
desire
quickly
neither
active
style
inside
remain
someone
department
principle
wrong
chief
share
actual
floor
serious
union
recent
relation
east
heavy
foot
unit
unless
useful
begin
legal
choice
mouth
cross
blue
green
popular
religion
gold
towards
command
separate
rise
supply
regard
plant
board
memory
stop
key
fell
evening
summer
literature
independent
duty
month
variety
miss
speech
completely
demand
receive
tree
allow
leaves
additional
continue
goes
window
serve
scale
offer
freedom
upper
whatever
college
marriage
piece
opportunity
none
medical
lack
previous
claim
carry
relative
financial
stay
failure
attack
skin
goods
glass
environment
meant
interesting
successful
happy
reach
street
box
event
reaction
add
international
hot
daily
yourself
negative
association
race
develop
game
rich
connection
ancient
chance
pattern
judgment
appearance
bit
iron
spent
otherwise
worth
firm
master
arm
drawn
gas
prevent
western
perfect
enemy
horse
title
sign
progress
exercise
visit
mental
ship
bank
computer
news
contract
agreement
trust
fair
sight
animal
sleep
wind
battle
advantage
understood
historical
usual
obtain
spring
square
address
cover
scene
male
double
spoke
practical
female
notice
dry
equipment
powerful
laid
ought
avoid
council
traditional
exist
police
enter
brain
exactly
committee
ran
argument
soil
post
speed
break
correct
stone
shape
walk
bear
anyone
bottom
straight
communication
regular
feelings
balance
trouble
send
justice
ordinary
passage
accept
evil
machine
dear
description
broken
protection
exchange
gain
opposite
film
sex
save
sold
search
village
wood
bound
explain
responsible
hardly
pleasure
birth
message
fast
sexual
carefully
concerning
fight
spread
difficulty
scientific
winter
fresh
concern
rose
mine
represent
path
team
drive
expect
pretty
sister
lie
edge
sum
check
everyone
minute
broad
officer
prove
article
strange
pure
fish
ill
fit
industrial
nine
danger
official
soft
beauty
pointed
origin
wild
brown
absence
familiar
eat
contain
choose
caught
fellow
possibility
plane
judge
shot
taught
suggest
network
lady
suppose
warm
politics
attitude
belief
grow
store
famous
yellow
employment
recently
occasion
secret
ourselves
buy
youth
division
watch
drug
examination
excellent
touch
grew
chosen
rock
silver
sit
metal
safe
baby
wait
severe
slow
hospital
doctor
corner
bar
farm
library
build
chair
heaven
smile
bright
fourth
thin
narrow
bill
season
combination
dog
solid
advance
express
favor
hall
station
dinner
train
hill
false
reasonable
detail
confidence
struggle
willing
draw
captain
extremely
reduce
sale
establish
quiet
wave
advanced
safety
defense
limit
proof
happen
conversation
copy
insurance
typical
seat
quantity
milk
formal
joint
escape
election
island
sweet
thick
plain
sentence
circle
lose
signal
neck
affect
tend
camp
inner
dependent
describe
onto
angle
possibly
boat
height
afternoon
substance
silence
parallel
dream
plate
afraid
wealth
chemical
net
technical
agree
careful
spot
crime
violence
comparison
steel
possession
drink
lake
promise
grown
apart
wonder
salt
band
protect
hit
won
explanation
song
sky
park
block
ice
background
curve
payment
perform
bone
ahead
weak
poet
wine
mountain
twice
rapid
opposition
southern
ring
valuable
pair
taste
request
garden
breath
sell
honor
recognize
flat
extreme
travel
beneath
drop
vote
secretary
worse
poetry
adult
cried
clean
dangerous
fruit
owner
stream
joy
teeth
reduction
intelligence
fat
rare
tube
please
frame
sugar
damage
muscle
cup
clothes
liquid
load
ball
mark
injury
holy
coast
instrument
permission
layer
profit
provisions
tendency
empty
fairly
instruction
advice
weather
broke
permanent
raise
zero
struck
guide
kill
feature
join
root
quick
continuous
forest
beside
debt
universal
mention
competition
depth
aside
sick
chain
sharp
prayer
recognition
forget
grace
shoulder
dress
begun
drew
preparation
poem
sudden
northern
rain
fashion
cycle
suit
lying
determination
enjoy
mail
trip
spend
parent
bought
document
glad
ear
branch
radio
wise
queen
improve
probability
silent
wisdom
opposed
achieve
gray
noise
partly
gift
discuss
spite
alive
mixture
prince
journey
motor
remove
teach
decide
quarter
fill
kitchen
map
permit
realize
screen
improvement
manager
nerve
driven
frequent
television
introduction
bread
crowd
institution
spoken
fail
snow
maybe
arrangement
glory
dance
slight
afterwards
strike
coffee
nice
alcohol
flight
conscious
skill
count
waste
surprise
criticism
imagine
tall
minister
oxygen
gun
destruction
tongue
criminal
bridge
smooth
distant
satisfaction
suitable
victory
establishment
card
slave
witness
representative
cry
shook
sand
handle
exact
newspaper
hurt
kingdom
engine
guard
meat
host
depend
provision
nervous
infection
chest
guess
electric
sheet
rank
track
imagination
shop
mile
wear
grass
noble
flesh
breast
medicine
uniform
discovery
win
coal
grave
unusual
pride
worship
nose
listen
vary
republic
sorry
anxiety
fort
prison
sensitive
hotel
valley
examine
bird
painting
definite
wire
star
fallen
hole
partner
catch
anger
terrible
pale
grand
moon
gentleman
shore
royal
cool
phrase
reply
admit
treat
tool
beat
row
everywhere
eastern
print
worthy
entrance
telephone
border
outer
thrown
traffic
suffer
illness
pleasant
angry
fly
fate
busy
pleased
forgotten
comfort
dust
intention
hat
punishment
pick
priest
tea
fifth
grain
belong
childhood
discover
cotton
whenever
shut
hidden
universe
murder
smoke
port
throw
prepare
corn
decrease
blind
wages
threat
rough
finger
arrival
courage
desirable
violent
altogether
habit
leg
fought
loose
friendly
hung
honest
copper
feed
involve
wet
proud
o'clock
tired
coat
delay
worst
accident
drove
besides
contents
fault
operate
pull
ride
steam
favorite
custom
healthy
roof
stomach
mistake
attend
seed
threw
guilty
blow
comfortable
shock
soldier
desk
destroy
thank
possess
temporary
lawyer
dying
cattle
laugh
afford
customer
fever
golden
ocean
aim
storm
fun
gate
measurement
nurse
sad
praise
club
centre
servant
steady
temple
cloth
somewhere
helpful
match
expensive
wound
shadow
profession
string
fortune
throat
bag
neighborhood
abroad
complicated
wore
dollar
employer
compound
pipe
anxious
civilization
meal
pocket
pray
sword
raw
marry
satisfactory
tail
clothing
tender
button
wing
flower
calm
apartment
attractive
approval
compare
gentle
worry
beam
chose
formerly
bent
welcome
wooden
stick
shell
loud
sing
harm
wheel
worn
faithful
breakfast
pool
achievement
sympathy
everybody
electronic
favorable
encourage
roll
somehow
conscience
bitter
prefer
bottle
organ
hate
alike
proposal
parliament
accordance
excited
finish
sheep
argue
cat
leaf
magazine
convenient
split
vehicle
defeat
yard
citizen
desert
yours
educated
anywhere
warning
plenty
mirror
bare
satisfy
rent
plastic
width
log
lesson
fed
absent
paint
acceptable
factory
solve
preserve
tight
manage
delight
creature
machinery
affair
arrive
hide
inquiry
painful
bore
wheat
emotion
cream
egg
intelligent
knife
clay
stem
reward
bus
labour
odd
refuse
delicate
pound
farmer
tomorrow
repeat
guidance
camera
butter
precious
beach
push
repair
artificial
aircraft
powder
equality
stranger
slope
burst
navy
defend
mystery
magic
furniture
gentlemen
mad
dried
settle
cap
uncle
smell
crop
replace
cloud
surprising
fancy
guilt
introduce
palace
apparatus
deliver
wives
grief
bell
employ
honour
strict
succeed
yesterday
blame
rice
shirt
shame
cord
protest
companion
somebody
pen
eager
generous
consist
lift
tie
orange
restaurant
wedding
stroke
asleep
terror
brave
dare
fool
flame
devil
flag
mix
prisoner
clock
circular
tobacco
rode
colour
dull
sixth
theater
tour
cure
shade
dealt
anybody
silk
definitely
sorrow
pink
verb
fame
cook
ate
widespread
owing
remark
borne
bacteria
romantic
clerk
pupil
collect
kiss
pity
divide
tribe
pour
beer
luck
knee
complaint
singular
package
laughter
rubber
communicate
leather
bowl
excuse
theatre
carriage
gather
bath
piano
fur
declaration
naval
slip
ceremony
humor
grateful
swept
burn
juice
tower
guest
cruel
pole
chicken
pilot
sensation
wash
mineral
fix
torn
monthly
stuck
hang
engineer
rod
actor
flour
mathematics
mysterious
lamp
hungry
splendid
brush
cheese
belt
lit
patience
wake
pot
grandfather
faint
brick
tonight
loyalty
rush
shoot
favour
purple
declare
shelter
invention
pump
backward
defence
frozen
lung
mud
thorough
temper
pack
useless
bush
funeral
fox
weapon
combine
rope
trunk
rat
aunt
peaceful
flood
slept
illegal
ours
railway
needle
dirty
horizon
pause
forehead
pan
furnish
mouse
cheap
neighbor
polish
unexpected
rid
sympathetic
sail
ruin
ceiling
castle
cheek
exciting
admiration
crazy
weekly
drunk
stretch
jump
photograph
seventh
flew
electricity
gotten
fold
thread
voyage
atom
solemn
tin
shake
wicked
hers
entertainment
fond
stupid
threatening
upset
lip
charm
hatred
tear
eaten
impressive
autumn
sport
decay
ignore
tent
tries
sang
funny
emphasize
supper
lonely
confident
pile
fence
sink
slide
foolish
protective
obey
sensible
hollow
offensive
earn
influential
organize
lock
prize
dish
arch
deliberately
invitation
dirt
grandmother
forgot
attendance
gradual
lately
nest
fierce
hunger
connect
forgive
beaten
attract
wool
climb
adventure
behaviour
drag
chemistry
warmth
eighth
refusal
deer
calculate
cow
flash
popularity
apple
pin
encouragement
blade
tooth
steep
nowhere
lucky
vegetable
collar
forbidden
chin
awake
inform
stiff
brass
pepper
enjoyment
loyal
mice
owe
hut
grey
crack
hurry
keen
fortunate
spell
arrange
ruler
pencil
cries
deserve
aloud
tropical
urge
basket
concert
cake
trap
swing
passenger
cigarette
lean
sincere
football
clever
poison
ticket
tune
birthday
ugly
intend
beg
thumb
drank
coin
react
similarity
lion
shield
flies
offense
joke
ashamed
horn
upright
remind
elastic
hire
trick
meter
risen
lightning
limb
spin
bomb
cement
grammar
bind
hunt
bend
noun
stolen
envelope
deliberate
barrel
persuade
ink
imaginary
signature
waist
govern
compete
breathe
pig
bite
tense
inward
lend
soup
behave
doorway
proven
hook
jaw
swung
container
complain
silly
opponent
oppose
rude
drum
curse
soap
explosion
descriptive
transparent
sprang
holiday
scientist
cheerful
bless
neat
urgent
upstairs
oneself
blew
burial
elect
broadcast
pretend
snake
theirs
sweep
invite
elbow
thunder
jealous
airport
daring
unite
beard
sank
swear
shelf
ninth
advise
sung
hid
ladder
dictionary
shoe
breadth
quarrel
chocolate
curtain
steal
candle
dug
procession
sore
approve
screw
wrist
burnt
knock
fulfill
insect
bunch
messenger
whisper
jealousy
seize
breed
stamp
amusement
sunk
slid
chase
bullet
rabbit
diamond
crash
insure
nonsense
shine
awkward
honesty
borrow
ash
punish
inquire
graceful
honorable
multiply
cruelty
harmful
hopeless
countryside
swim
cart
tennis
shout
polite
admire
float
morals
outdoor
appoint
accidental
pet
relax
mist
ripe
lamb
kick
toe
bred
specialist
packet
shone
merry
celebrate
hammer
shaken
fairy
yearly
weigh
plural
shy
microscope
warn
nail
cage
thirst
lid
potato
boil
amusing
dig
careless
fork
translate
insult
scenery
decimal
programme
restrict
skirt
whoever
bee
fashionable
entertain
tourist
melt
infectious
swollen
tore
threaten
stole
politician
cough
decoration
cliff
lent
bored
onion
descend
skies
cheer
boot
twist
photography
sworn
vowel
swallow
woven
favourite
garage
hello
toilet
whip
toy
drawer
noticeable
garment
worm
sour
nut
harmless
tire
knot
armor
confusing
thief
swell
heel
adjective
monkey
greeting
crept
wander
fireplace
gram
interrupt
metric
lazy
duck
jewelry
handkerchief
explosive
goat
dismiss
announce
old-fashioned
shelves
freeze
berry
spear
advertisement
dot
ankle
musician
hen
cultivate
trousers
elephant
spun
chimney
whistle
mat
bucket
spoon
dip
excite
greet
lump
feather
boring
crush
humour
habitual
surround
wrap
neighbourhood
actress
ditch
swore
backwards
forbid
wreck
alphabet
bean
instruct
parcel
hopeful
secrecy
deceive
taxi
humorous
hasty
glue
poisonous
bury
educate
sprung
knelt
lodging
creep
spoil
rub
fishermen
rob
spelled
obedient
bicycle
thieves
spoiled
cinema
frightening
forgiven
shiny
hanged
hardship
discourage
waiter
ant
icy
pronounce
enclosure
embarrassing
nasty
liter
learnt
consonant
flown
ridden
tiger
respectful
lied
injure
pronunciation
tremble
competitor
hairy
shocking
scatter
neighbour
chalk
comb
cardboard
upside
confuse
hourly
invent
honourable
annoyance
skillful
halves
fulfil
criticize
sideways
foreigner
forbade
weave
bowels
anyhow
sting
sticky
tying
loaf
stitch
indoor
offend
scissors
jelly
bake
outdoors
thirsty
banana
practise
whichever
coward
slippery
enjoyable
swam
fisherman
annoying
jewel
amuse
relaxing
nobleman
ache
cheat
froze
beak
deceit
drown
senseless
subtract
lain
frighten
suck
undone
goodbye
disappointing
lodgings
curl
bleed
indoors
armour
forwards
enclose
explode
undo
bitten
spacecraft
magician
cupboard
participle
grieve
stair
cowardly
insulting
advertise
underwear
calculator
mend
pastry
bathe
kneel
nylon
stung
woolen
fasten
sew
pence
metre
centimeter
tidy
abbreviation
adverb
cricket
bled
spade
loaves
decorate
tyre
admittance
embarrass
discouragement
infect
eyelid
harden
sewn
hundredth
annoy
kilogram
someplace
dreamt
disappoint
woollen
prickly
wrongdoing
offence
favourable
forgave
wove
dries
tiring
kilometer
timetable
sock
petrol
cheque
thousandth
shopkeeper
grandparent
organise
footstep
undid
kilo
footpath
clockwork
jewellery
chairperson
skilful
litre
millionth
farmyard
centimetre
swum
kilometre
cannot
undoes
per cent
according to
no one
deal with
owing to
made up
in spite of
dealt with
consist of
find out
make up
look for
rid of
as opposed to
pick up
found out
lay down
look after
look up
made into
only just
lie down
upside down
let go of
lying down
make into
lain down`;
