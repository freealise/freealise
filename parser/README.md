### TODO:  
merge defining vocabularies, sort by frequency and POS  
https://learnthesewordsfirst.com/about/other-learners-dictionaries.html  

do tf-idf independently (https://en.wikipedia.org/wiki/Tf-idf)  
download POS data for controlled vocabulary out of dictionary and the frequencies from local cmudict (or google books ngrams | ngrams.dev); merge with vocalise  
  
// for the pos highlighter  
ps[j].innerText = sb.charAt(i);  
ps[j].parentElement.style.opacity = 1.0-(imp.indexOf(sb.charAt(i))+1)/12.5;  
ps[j].parentElement.style.filter = 'hue-rotate(' + imp.indexOf(sb.charAt(i))*36 + 'deg)';  
  