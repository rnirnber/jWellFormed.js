jWellFormed.js (0.1)
---------------

The purpose of the jWellFormed.js project is to unify client-side form-validation and submission control across a website. 

The project seeks to alleviate those who can sympathize with the following realities of web development:

  - Client-side form validation is more often than not too bland and dry to avoid the copy-paste train
  - Managing if statements becomes increasing complex as more elements are added to a form, especially when ANDing, ORing, and nesting come into play.
  - Code-reuse is difficult to achieve with form-validation, because often times client-side code is tightly coupled to particular DOM snippets, and it's often easier to simply rewrite code instead of trying to make it DOM-agnostic.
  
jWellFormed.js hopes to provide end-users with something slightly better than what's out there now. In comparison with the JQuery Validation plugin, jWellFormed.js seeks to offer something that's a little more interesting to work with and that focuses more on the need for user-defined, one-off type of functionality rather than the boiler-plate CC #, date, email, etc. stuff that most browsers give you for free nowadays via HTML5 input types.

Features:
---------

  - Embraces jQuery's implict iteration via css-style selectors. Multiple form elements can be validated against the same user-defined Fn's, where the first element in a set to fails validation can be highlighted.
  - Experimental support for Async validation via HTTP GET and POST.
  - No documentation required, it's super simple! Just see the example page. 



What should my Fn look like?
----------------------------
Quite simply really. Your function will receive the form element(s) you pass in the .ensure() method. Based off of the element received--and possibly other indicators--you simply return true if it passes your spec or false otherwise.

See it live:
-----

**[Example Page] for live demo**

Todo:
-----

Maybe come up with a better example page and I may be wrong on the claim that no documention is required.

  [Example Page]: http://raymondnirnberger.com/jWellFormed/Example/

