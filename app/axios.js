import * as $axios from 'axios/dist/axios';
$axios.defaults.withCredentials = true;
export default $axios.create({
	baseURL: 'https://karpala.ru/',
});