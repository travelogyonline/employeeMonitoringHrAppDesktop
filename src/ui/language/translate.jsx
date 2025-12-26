import english from './english.json';
import assamese from './assamese.json';

export default function translate(language="english", value)
{
    if(!value) return;
    if(language==="english"){
        return english[value];
    }
    if(language==="assamese"){
        return assamese[value];
    }
}