import english from './languages/english.json';
import assamese from './languages/assamese.json';
import hindi from './languages/hindi.json';

export default function translate(language="english", value)
{
    if(!value) return;
    if(language==="english") return english[value];
    if(language==="assamese") return assamese[value]
    if(language==="hindi") return hindi[value]
}