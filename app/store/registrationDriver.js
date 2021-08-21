import axios from '@/axios';

const state = () => ({
	started: false,
	finish: false,
	waiting: false,
	isValid: true,
	steps: [{
		active: true,
		name: 'Car',
		code: 'car',
		requiredFields: ['car_make', 'car_model', 'car_number', 'car_color', 'car_images'],
	}, {
		active: false,
		name: 'Documents',
		code: 'documents',
		requiredFields: ['driver_license', 'certificate_ts'],
	}, {
		active: false,
		name: 'Driver',
		code: 'driver',
		requiredFields: ['name', 'lastname', 'year_of_birth', 'driver_license_series_number', 'city', 'description', 'avatar'],
	}],
	registrationData: {
		// car
		car_make                     : '',
		car_model                    : '',
		car_number                   : '',
		car_color                    : '',
		car_images                   : null,
		// documents
		driver_license               : null,
		certificate_ts               : null,
		carriage_permit              : null,
		// driver
		name                         : '',
		lastname                     : '',
		year_of_birth                : '',
		driver_license_series_number : '',
		city                         : '',
		description                  : '',
		avatar                       : null,
	},
	registrationDataErrors: {
		// car
		car_make                     : false,
		car_model                    : false,
		car_number                   : false,
		car_color                    : false,
		car_images                   : false,
		// documents
		driver_license               : false,
		certificate_ts               : false,
		carriage_permit              : false,
		// driver
		name                         : false,
		lastname                     : false,
		year_of_birth                : false,
		driver_license_series_number : false,
		city                         : false,
		description                  : false,
		avatar                       : false,
	},
	isEdit: false,
	carModels: [],
	carColors: [],
});

const getters = {
	activeStepIndex            : (state) => state.steps.findIndex(step => step.active),
	activeStep                 : (state, getters) => state.steps[getters.activeStepIndex],
	isFirstStep                : (state, getters) => getters.activeStepIndex === 0,
	isLastStep                 : (state, getters) => getters.activeStepIndex === state.steps.length - 1,
	getRegistrationData        : (state) => state.registrationData,
	getCarModels               : (state) => state.carModels,
	getCarColors               : (state) => state.carColors,
};

const mutations = {
	setIsEdit(state, value)
	{
		state.isEdit = !!value;
	},
	validate(state)
	{
		state.isValid = true;
		const activeStep = state.steps.find(step => step.active);
		for (let fieldKey of activeStep.requiredFields)
		{
			if (!state.registrationData[fieldKey])
			{
				state.registrationDataErrors[fieldKey] = true;
				state.isValid = false;
			}
			else
				state.registrationDataErrors[fieldKey] = false;
		}
	},
	registrationStart(state)
	{
		state.started = true;
	},
	setStep(state, step)
	{
		const activeStepIndex = state.steps.findIndex(step => step.active);
		state.steps[step].active = true;
		state.steps[activeStepIndex].active = false;
	},
	nextStep(state)
	{
		const activeStepIndex = state.steps.findIndex(step => step.active);
		state.steps[activeStepIndex + 1].active = true;
		state.steps[activeStepIndex].active = false;
	},
	prevStep(state)
	{
		const activeStepIndex = state.steps.findIndex(step => step.active);
		if(activeStepIndex == 0)
		{
			state.started = false;
			return;
		}
		else if(activeStepIndex === state.steps.length - 1 && state.finish)
			state.finish = false;
		else if(activeStepIndex !== 0)
		{
			state.steps[activeStepIndex - 1].active = true;
			state.steps[activeStepIndex].active = false;
		}
	},
	setWaiting(state, waiting)
	{
		state.waiting = waiting;
	},
	setFinish(state, finish)
	{
		state.finish = finish;
	},
	setRegistrationData(state, data)
	{
		state.registrationData = Object.assign({}, state.registrationData, data);
	},
	clearRegistrationData(state)
	{
		for (let key in state.registrationData)
			state.registrationData[key] = typeof state.registrationData[key] === 'String' ? '' : null;
	},
	setCarModels(state, models)
	{
		state.carModels = models;
	},
	setCarColors(state, colors)
	{
		state.carColors = colors;
	},
};

const actions = {
	async nextStep({state, dispatch, commit, getters})
	{
		commit('validate');

		if (state.finish || !state.isValid) return;

		const activeStepIndex = state.steps.findIndex(step => step.active);
		if (getters.isLastStep) return await dispatch('endRegistration');
		commit('nextStep');
	},
	async endRegistration({state, commit, dispatch})
	{
		if (state.finish || state.waiting)
			return;

		commit('setWaiting', true);
		const url = state.isEdit ? '/api/drivers/editProfile/' : '/api/drivers/signup/';
		const registrationResult = await dispatch('submitRegistrationData', url);
		if (registrationResult.data.success)
		{
			commit('setFinish', true);
			return;
		}
		else
		{
			if (registrationResult.data.errors)
			{
				let errors = Object.values(registrationResult.data.errors);
				alert(`Ошибки в данных:\n${errors.join("\n")}`);
			}
			else
				alert(`Ошибки в данных`);

			// commit('setStep', 0);
		}

		commit('setWaiting', false);
	},
	async submitRegistrationData({ state, commit }, url)
	{
		const data = new FormData();
		for (let fieldKey in state.registrationData)
		{
			if (state.registrationData[fieldKey] && typeof state.registrationData[fieldKey] === 'object' && state.registrationData[fieldKey].length)
			{
				for (let image of state.registrationData[fieldKey])
				{
					if (image && image.isExist)
						data.append(`${fieldKey}[]`, image.path);
					else
						data.append(`${fieldKey}[]`, image);
				}
				continue;
			}

			data.append(fieldKey, state.registrationData[fieldKey] || '');
		}

		const registrationResult = await $axios({
			url,
			method: 'POST',
			data: data,
			headers: {
				'Content-Type': 'multipart/form-data'
			},
		});
		commit('setWaiting', false);
		return registrationResult;
	},
	async getDefaultRegistrationData({state, commit})
	{
		const result = await $axios({
			url: '/api/drivers/getFullInfo/',
			method: 'GET',
			headers: {
				'Content-Type': 'multipart/form-data'
			},
		});

		if (!result.data.success)
			return;

		const registrationData = state.registrationData;
		for (let fieldKey in result.data.data)
		{
			if (!Array.isArray(result.data.data[fieldKey]))
			{
				registrationData[fieldKey] = result.data.data[fieldKey];
				continue;
			}
			else
				registrationData[fieldKey] = null;
			for (let image of result.data.data[fieldKey])
			{
				if (image === 'null' || !image || !image.match(/[\.a-zA-Z0-9]+$/)) continue;

				let imageFile = await $axios({
					url: image,
					method: 'get',
					responseType: 'blob',
					headers: {
						'Content-Type': 'multipart/form-data'
					},
				});
				if (imageFile.status === 200 && imageFile.data.size)
				{
					let imageName = image.match(/[\.a-zA-Z0-9]+$/)[0];
					let resultImage = new File([imageFile.data], imageName);
					resultImage.isExist = true;
					resultImage.path = image;

					if(Array.isArray(registrationData[fieldKey]))
						registrationData[fieldKey].push(resultImage);
					else
						registrationData[fieldKey] = [resultImage];
				}
			}
		}

		commit('setRegistrationData', registrationData);
	},
	async getCarModels({state, commit})
	{
		const result = await $axios({
			url: '/api/drivers/getCarModels/',
			method: 'GET',
		});
		commit('setCarModels', result.data.models);
	},
	async getCarColors({state, commit})
	{
		const result = await $axios({
			url: '/api/drivers/getCarColors/',
			method: 'GET',
		});
		commit('setCarColors', result.data.colors);
	},
};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions
};
