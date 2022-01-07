import { useFieldsStore } from '@/stores';
import { definePanel } from '@directus/shared/utils';
import { Panel } from '@directus/shared/types';
import PanelMetric from './metric.vue';

const fieldOptions = [
	{
		field: 'collection',
		type: 'string',
		name: '$t:collection',
		meta: {
			interface: 'system-collection',
			options: {
				includeSystem: true,
			},
			width: 'half',
		},
	},
	{
		field: 'field',
		type: 'string',
		name: '$t:panels.metric.field',
		meta: {
			interface: 'system-field',
			options: {
				collectionField: 'collection',
				allowPrimaryKey: true,
				allowNone: true,
			},
			width: 'half',
		},
	},
	{
		field: 'function',
		type: 'string',
		name: '$t:aggregate_function',
		meta: {
			width: 'half',
			interface: 'select-dropdown',
			options: {
				choices: [
					{
						text: 'Count',
						value: 'count',
					},
					{
						text: 'Count (Distinct)',
						value: 'count_distinct',
					},
					{
						text: 'Average',
						value: 'avg',
					},
					{
						text: 'Average (Distinct)',
						value: 'avg_distinct',
					},
					{
						text: 'Sum',
						value: 'sum',
					},
					{
						text: 'Sum (Distinct)',
						value: 'sum_distinct',
					},
					{
						text: 'Minimum',
						value: 'min',
					},
					{
						text: 'Maximum',
						value: 'max',
					},
					{
						text: 'First',
						value: 'first',
					},
					{
						text: 'Last',
						value: 'last',
					},
				],
			},
		},
	},
	{
		field: 'sortField',
		type: 'string',
		name: '$t:sort_field',
		meta: {
			interface: 'system-field',
			options: {
				collectionField: 'collection',
				allowPrimaryKey: true,
				placeholder: '$t:primary_key',
			},
			width: 'half',
		},
	},
	{
		field: 'filter',
		type: 'json',
		name: '$t:filter',
		meta: {
			interface: 'system-filter',
			options: {
				collectionField: 'collection',
			},
		},
	},
	{
		field: 'styleDivider',
		type: 'alias',
		meta: {
			interface: 'presentation-divider',
			options: {
				icon: 'style',
				title: 'Style & Format',
			},
			special: ['alias', 'no-data'],
		},
	},
	{
		field: 'abbreviate',
		type: 'boolean',
		name: '$t:abbreviate_value',
		schema: {
			default_value: false,
		},
		meta: {
			interface: 'boolean',
			width: 'half',
		},
	},
	{
		field: 'decimals',
		type: 'integer',
		name: '$t:decimals',
		meta: {
			interface: 'input',
			width: 'half',
			options: {
				placeholder: '$t:decimals_placeholder',
			},
		},
		schema: {
			default_value: 0,
		},
	},
	{
		field: 'prefix',
		type: 'string',
		name: '$t:prefix',
		meta: {
			interface: 'input',
			width: 'half',
			options: {
				placeholder: '$t:prefix_placeholder',
				trim: false,
			},
		},
	},
	{
		field: 'suffix',
		type: 'string',
		name: '$t:suffix',
		meta: {
			interface: 'input',
			width: 'half',
			options: {
				placeholder: '$t:suffix_placeholder',
				trim: false,
			},
		},
	},
	{
		field: 'conditionalFormatting',
		type: 'json',
		name: '$t:conditional_styles',
		meta: {
			interface: 'list',
			width: 'full',
			options: {
				template: '{{color}} {{operator}} {{value}}',
				fields: [
					{
						field: 'operator',
						name: '$t:operator',
						type: 'string',
						schema: {
							default_value: '>=',
						},
						meta: {
							interface: 'select-dropdown',
							options: {
								choices: [
									{
										text: '$t:operators.eq',
										value: '=',
									},
									{
										text: '$t:operators.neq',
										value: '!=',
									},
									{
										text: '$t:operators.gt',
										value: '>',
									},
									{
										text: '$t:operators.gte',
										value: '>=',
									},
									{
										text: '$t:operators.lt',
										value: '<',
									},
									{
										text: '$t:operators.lte',
										value: '<=',
									},
								],
							},
							width: 'half',
						},
					},
					{
						field: 'value',
						name: '$t:value',
						type: 'integer',
						schema: {
							default_value: 0,
						},
						meta: {
							interface: 'input',
							width: 'half',
						},
					},
					{
						field: 'color',
						name: '$t:color',
						type: 'string',
						schema: {
							default_value: '#00C897',
						},
						meta: {
							interface: 'select-color',
							display: 'color',
						},
					},
				],
			},
		},
	},
];

export default definePanel({
	id: 'metric',
	name: '$t:panels.metric.name',
	description: '$t:panels.metric.description',
	icon: 'functions',
	component: PanelMetric,
	alterOptions: (panel: Partial<Panel>, edits: Partial<Panel>) => {
		if (!edits || !panel) return;
		if (!edits.options || !edits.options.collection || !edits.options.field || !panel.options) return panel;

		const fieldStore = useFieldsStore();
		const field = fieldStore.getField(edits.options.collection, edits.options.field);

		if (!field || !field.type) return panel;

		if (!['integer', 'bigInteger', 'float', 'decimal'].includes(field.type)) {
			for (const choice of fieldOptions[2].meta.options.choices) {
				if (!['count', 'first', 'last'].includes(choice.value)) {
					choice.disabled = true;
				}
			}
		} else {
			for (const choice of fieldOptions[2].meta.options.choices) {
				choice.disabled = false;
			}
		}
		panel.options = fieldOptions;
		return panel;
	},
	options: fieldOptions,
	minWidth: 8,
	minHeight: 6,
});
