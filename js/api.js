import {API_BASE} from './config.js';
let token=sessionStorage.getItem('lvt_token')||'';
export const setToken=v=>{token=v||'';if(token)sessionStorage.setItem('lvt_token',token);else sessionStorage.removeItem('lvt_token')};
export const hasToken=()=>!!token;
export async function api(path,{method='GET',data}={}){let response;try{response=await fetch(API_BASE+path,{method,headers:{...(data!==undefined?{'Content-Type':'application/json'}:{}),...(token?{Authorization:'Bearer '+token}:{})},...(data!==undefined?{body:JSON.stringify(data)}:{})})}catch{throw new Error('Không kết nối được API. Kiểm tra Internet và cấu hình CORS của Worker.')};let result;try{result=await response.json()}catch{throw new Error('Máy chủ trả về dữ liệu không hợp lệ')};if(!response.ok)throw new Error(result.error||result.message||`Lỗi HTTP ${response.status}`);return result}
export const listData=(result,key)=>Array.isArray(result)?result:Array.isArray(result?.[key])?result[key]:Array.isArray(result?.items)?result.items:[];
