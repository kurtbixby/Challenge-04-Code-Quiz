export const allQuestions = [
    {
      "prompt": "Javascript is an _______ language?",
      "choices": [
        "Object-Oriented",
        "Object-Based",
        "Procedural",
        "None of the above"
      ],
      "answer": "Object-Oriented"
    },
    {
      "prompt": "Which of the following keywords is used to define a variable in Javascript?",
      "choices": [
        "var",
        "let",
        "Both A and B",
        "None of the above"
      ],
      "answer": "Both A and B"
    },
    {
      "prompt": "Which of the following methods is used to access HTML elements using Javascript?",
      "choices": [
        "getElementbyId()",
        "getElementsByClassName()",
        "Both A and B",
        "None of the above"
      ],
      "answer": "Both A and B"
    },
    {
      "prompt": "Upon encountering empty statements, what does the Javascript Interpreter do?",
      "choices": [
        "Throws an error",
        "Ignores the statements",
        "Gives a warning",
        "None of the above"
      ],
      "answer": "Ignores the statements"
    },
    {
      "prompt": "Which of the following methods can be used to display data in some form using Javascript?",
      "choices": [
        "document.write()",
        "console.log()",
        "window.alert()",
        "All of the above"
      ],
      "answer": "All of the above"
    },
    {
      "prompt": "How can a datatype be declared to be a constant type?",
      "choices": [
        "const",
        "var",
        "let",
        "constant"
      ],
      "answer": "const"
    },
    {
      "prompt": "What will be the output of the following code snippet?",
      "code": "<script type=\"text/javascript\">\na = 5 + \"9\";\ndocument.write(a);\n</script>",
      "choices": [
        "Compilation Error",
        "14",
        "Runtime Error",
        "59"
      ],
      "answer": "59"
    },
    {
      "prompt": "What will be the output of the following code snippet?",
      "code": "<script type=\"text/javascript\" language=\"javascript\">\n  \nvar a = \"Scaler\";\nvar result = a.substring(2, 4);\ndocument.write(result);\n  \n</script>",
      "choices": [
        "al",
        "ale",
        "cal",
        "caler"
      ],
      "answer": "al"
    },
    {
      "prompt": "What will be the output of the following code snippet?",
      "code": "<script type=\"text/javascript\" language=\"javascript\">\n \nvar x=12;\nvar y=8;\nvar res=eval(\"x+y\");\ndocument.write(res);\n \n</script>",
      "choices": [
        "20",
        "x+y",
        "128",
        "None of the above"
      ],
      "answer": "20"
    },
    {
      "prompt": "When the switch statement matches the expression with the given labels, how is the comparison done?",
      "choices": [
        "Both the datatype and the result of the expression are compared.",
        "Only the datatype of the expression is compared.",
        "Only the value of the expression is compared.",
        "None of the above."
      ],
      "answer": "Both the datatype and the result of the expression are compared."
    },
    {
      "prompt": "What keyword is used to check whether a given property is valid or not?",
      "choices": [
        "in",
        "is in",
        "exists",
        "lies"
      ],
      "answer": "in"
    },
    {
      "prompt": "What is the use of the <noscript> tag in Javascript?",
      "choices": [
        "The contents are displayed by non-JS-based browsers.",
        "Clears all the cookies and cache.",
        "Both A and B.",
        "None of the above."
      ],
      "answer": "The contents are displayed by non-JS-based browsers."
    },
    {
      "prompt": "What will be the output of the following code snippet?",
      "code": "(function(){\n setTimeout(()=> console.log(1),2000);\n console.log(2);\n setTimeout(()=> console.log(3),0);\n console.log(4);\n})();",
      "choices": [
        "1 2 3 4",
        "2 3 4 1",
        "2 4 3 1",
        "4 3 2 1"
      ],
      "answer": "2 4 3 1"
    },
    {
      "prompt": "What will be the output of the following code snippet?",
      "code": "(function(a){\n return (function(){\n   console.log(a);\n   a = 6;\n })()\n})(21);",
      "choices": [
        "6",
        "NaN",
        "21",
        "None of the above"
      ],
      "answer": "21"
    },
    {
      "prompt": "What will be the output of the following code snippet?",
      "code": "function solve(arr, rotations){\n if(rotations == 0) return arr;\n for(let i = 0; i < rotations; i++){\n   let element = arr.pop();\n   arr.unshift(element);\n }\n return arr;\n}\n// solve([44, 1, 22, 111], 5);",
      "choices": [
        "[111, 44, 1, 22]",
        "[44, 1, 22, 111]",
        "[111, 44, 1, 22]",
        "[1, 22, 111, 44]"
      ],
      "answer": "[111, 44, 1, 22]"
    },
    {
      "prompt": "What will be the output for the following code snippet?",
      "code": "<p id=\"example\"></p>  \n<script>  \nfunction Func()  \n{  \ndocument.getElementById(\"example\").innerHTML=Math.sqrt(81);  \n}  \n</script>",
      "choices": [
        "9",
        "81",
        "Error",
        "0"
      ],
      "answer": "9"
    },
    {
      "prompt": "When an operator’s value is NULL, the typeof returned by the unary operator is:",
      "choices": [
        "Boolean",
        "Undefined",
        "Object",
        "Integer"
      ],
      "answer": "Object"
    },
    {
      "prompt": "What will be the output of the following code snippet?",
      "code": "var a = 1;  \nvar b = 0;  \nwhile (a <= 3)  \n{  \n   a++;  \n   b += a * 2;  \n   print(b);\n}",
      "choices": [
        "4 10 18",
        "1 2 3",
        "1 4 7",
        "None of the above"
      ],
      "answer": "4 10 18"
    },
    {
      "prompt": "What does the Javascript “debugger” statement do?",
      "choices": [
        "It will debug all the errors in the program at runtime.",
        "It acts as a breakpoint in a program.",
        "It will debug error in the current statement if any.",
        "All of the above."
      ],
      "answer": "It acts as a breakpoint in a program."
    },
    {
      "prompt": "What will be the output of the following code snippet?",
      "code": "var a = Math.max();\nvar b = Math.min();\nprint(a);\nprint(b);",
      "choices": [
        "-Infinity Infinity",
        "Infinity -Infinity",
        "Infinity Infinity",
        "-Infinity -Infinity"
      ],
      "answer": "-Infinity Infinity"
    },
    {
      "prompt": "What will be the output of the following code snippet?",
      "code": "var a = Math.max() < Math.min();\nvar b = Math.max() > Math.min();\nprint(a);\nprint(b);",
      "choices": [
        " true false",
        "false true",
        "true true",
        "false false"
      ],
      "answer": " true false"
    },
    {
      "prompt": "What will be the output of the following code snippet?",
      "code": "var a = true + true + true * 3;\nprint(a)",
      "choices": [
        "3",
        "0",
        "Error",
        "5"
      ],
      "answer": "5"
    },
    {
      "prompt": "What is the output of the following code snippet?",
      "code": "print(NaN === NaN);",
      "choices": [
        "true",
        "false",
        "undefined",
        "Error"
      ],
      "answer": "false"
    },
    {
      "prompt": "What will be the output of the following code snippet?",
      "code": "print(typeof(NaN));",
      "choices": [
        "Object",
        "Number",
        "String",
        "None of the above"
      ],
      "answer": "Number"
    },
    {
      "prompt": "What does the ‘toLocateString()’ method do in JS?",
      "choices": [
        "Returns a localised object representation.",
        "Returns a parsed string.",
        "Returns a localized string representation of an object.",
        "None of the above."
      ],
      "answer": "Returns a localized string representation of an object."
    },
    {
      "prompt": "The process in which an object or data structure is translated into a format suitable for transferral over a network, or storage is called?",
      "choices": [
        "Object Serialization",
        "Object Encapsulation",
        "Object Inheritance",
        "None of the above"
      ],
      "answer": "Object Serialization"
    },
    {
      "prompt": "Which function is used to serialize an object into a JSON string in Javascript?",
      "choices": [
        "stringify()",
        "parse()",
        "convert()",
        "None of the above"
      ],
      "answer": "stringify()"
    },
    {
      "prompt": "The 3 basic object attributes in Javascript are:",
      "choices": [
        "Class, prototype, objects' parameters.",
        "Class, prototype, object's extensible flag.",
        "Class, parameters, object's extensible flag.",
        "Classes, Native object, and Interfaces and Object's extensible flag."
      ],
      "answer": "Class, prototype, object's extensible flag."
    },
    {
      "prompt": "What will be the output of the following code snippet?",
      "code": "let sum = 0; \nconst a = [1, 2, 3];\na.forEach(getSum);\nprint(sum);\nfunction getSum(ele) {\n   sum += ele;\n}",
      "choices": [
        "6",
        "1",
        "2",
        "None of the above"
      ],
      "answer": "6"
    },
    {
      "prompt": "What will be the output of the following code snippet?",
      "code": "a = [1, 2, 3, 4, 5];\nprint(a.slice(2, 4));",
      "choices": [
        "3, 4",
        "2, 3",
        "3, 4, 5",
        "2, 3, 4"
      ],
      "answer": "3, 4"
    },
    {
      "prompt": "What will be the output of the following code snippet?",
      "code": "print(parseInt(\"123Hello\"));\nprint(parseInt(\"Hello123\"));",
      "choices": [
        "123 NaN",
        "123Hello Hello123",
        "NaN NaN",
        "123 123"
      ],
      "answer": "123 NaN"
    },
    {
      "prompt": "Which of the following are closures in Javascript?",
      "choices": [
        "Variables",
        "Functions",
        "Objects",
        "All of the above"
      ],
      "answer": "All of the above"
    },
    {
      "prompt": "Which of the following is not a Javascript framework?",
      "choices": [
        "Node",
        "Vue",
        "React",
        "Cassandra"
      ],
      "answer": "Cassandra"
    },
    {
      "prompt": "What will be the output of the following code snippet?",
      "code": "var a = \"hello\";\nvar sum = 0;\nfor(var i = 0; i < a.length; i++) {\n   sum += (a[i] - 'a');\n}\nprint(sum);",
      "choices": [
        "47",
        "NaN",
        "0",
        "None of the above"
      ],
      "answer": "NaN"
    },
    {
      "prompt": "What keyword is used to declare an asynchronous function in Javascript?",
      "choices": [
        "async",
        "await",
        "setTimeout",
        "None of the above"
      ],
      "answer": "async"
    },
    {
      "prompt": "How to stop an interval timer in Javascript?",
      "choices": [
        "clearInterval",
        "clearTimer",
        "intervalOver",
        "None of the above"
      ],
      "answer": "clearInterval"
    },
    {
      "prompt": "What will be the output of the following code snippet?",
      "code": "const set = new Set();\nset.add(5);\nset.add('Hello');\nset.add({ name: 'Scaler' });\nfor (let item of set) {\n console.log(item + 6);\n}",
      "choices": [
        "11 NaN NaN",
        "11 NaN [object Object]",
        "11 Hello6 [object Object]6",
        "None of the above"
      ],
      "answer": "11 Hello6 [object Object]6"
    },
    {
      "prompt": "How are objects compared when they are checked with the strict equality operator?",
      "choices": [
        "The contents of the objects are compared",
        "Their references are compared",
        "Both A and B",
        "None of the above"
      ],
      "answer": "Their references are compared"
    },
    {
      "prompt": "What does … operator do in JS?",
      "choices": [
        "It is used to spread iterables to individual elements",
        "It is used to describe a datatype of undefined size",
        "No such operator exists",
        "None of the above"
      ],
      "answer": "It is used to spread iterables to individual elements"
    },
    {
      "prompt": "What will be the output of the following code snippet?",
      "code": "const example = ({ a, b, c }) => {\n console.log(a, b, c);\n};\nexample(0, 1, 2);",
      "choices": [
        "0 1 2",
        "0 Undefined Undefined",
        "Undefined Undefined Undefined",
        "None of the above"
      ],
      "answer": "Undefined Undefined Undefined"
    },
    {
      "prompt": "What will be the output of the following code snippet?",
      "code": "let a = [1, 2, 3, 4, 5, 6];\nvar left = 0, right = 5;\nvar found = false;\nvar target = 5;\nwhile(left <= right) {\n   var mid = Math.floor((left + right) / 2);\n   if(a[mid] == target) {\n       found = true;\n       break;\n   }\n   else if(a[mid] < target) {\n       left = mid + 1;\n   }\n   else {\n       right = mid - 1;\n   }\n}\nif(found) {\n   print(\"YES\");\n}\nelse {\n   print(\"NO\");\n}",
      "choices": [
        "YES",
        "NO",
        "Syntax Error",
        "None of the above"
      ],
      "answer": "YES"
    },
    {
      "prompt": "What will be the output of the following code snippet?",
      "code": "let s = \"00000001111111\";\nlet l = 0, r = s.length - 1, ans = -1;\nwhile(l <= r) {\n   var mid = Math.floor((l + r) / 2);\n   if(s[mid] == '1') {\n       ans = mid;\n       r = mid - 1;\n   }\n   else {\n       l = mid + 1;\n   }\n}\nprint(ans);",
      "choices": [
        "8",
        "7",
        "0",
        "1"
      ],
      "answer": "7"
    },
    {
      "prompt": "What will be the output of the following code snippet?",
      "code": "let n = 24;\nlet l = 0, r = 100, ans = n;\nwhile(l <= r) {\n   let mid = Math.floor((l + r) / 2);\n   if(mid * mid <= n) {\n       ans = mid;\n       l = mid + 1;\n   }\n   else {\n       r = mid - 1;\n   }\n}\nprint(ans);",
      "choices": [
        "5",
        "4",
        "6",
        "3"
      ],
      "answer": "4"
    },
    {
      "prompt": "What will be the output of the following code snippet?",
      "code": "const obj1 = {Name: \"Hello\", Age: 16};\nconst obj2 = {Name: \"Hello\", Age: 16};\nprint(obj1 === obj2);",
      "choices": [
        "true",
        "false",
        "Undefined",
        "None of the above"
      ],
      "answer": "false"
    },
    {
      "prompt": "What happens when we run this code?\n\nfunction dog() {\n   print(\"I am a dog.\");\n}\ndog.sound = \"Bark\";",
      "choices": [
        "Syntax Error",
        "“I am a dog” gets printed",
        "ReferenceError",
        "Nothing happens"
      ],
      "answer": "Nothing happens"
    },
    {
      "prompt": "How do we write a comment in javascript?",
      "choices": [
        "/* */",
        "//",
        "#",
        "$ $"
      ],
      "answer": "//"
    },
    {
      "prompt": "Which object in Javascript doesn’t have a prototype?",
      "choices": [
        "Base Object",
        "All objects have a prototype",
        "None of the objects have a prototype",
        "None of the above"
      ],
      "answer": "Base Object"
    },
    {
      "prompt": "What will be the output of the following code snippet?",
      "code": "function test(...args) {\n console.log(typeof args);\n}\ntest(12);",
      "choices": [
        "NaN",
        "Number",
        "Object",
        "Array"
      ],
      "answer": "Object"
    },
    {
      "prompt": "What will be the output of the following code snippet?",
      "code": "const obj1 = {first: 20, second: 30, first: 50};\nconsole.log(obj1);",
      "choices": [
        "{first: 20, second: 30}",
        "{first: 50, second: 30}",
        "{first: 20, second: 30, first: 50}",
        "Syntax Error"
      ],
      "answer": "{first: 50, second: 30}"
    },
    {
      "prompt": "Which of the following are not server-side Javascript objects?",
      "choices": [
        "Date",
        "FileUpload",
        "Function",
        "All of the above"
      ],
      "answer": "All of the above"
    }
]