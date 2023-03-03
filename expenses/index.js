import { createApp } from "https://mavue.mavo.io/mavue.js";

const TRINITY = "trinity";
const NEO = "neo";
const JOINT = "joint";

globalThis.app = createApp({
	data: {
		expenses: [],
		formData: {
			description: null,
			for: null,
			neoPaid: null,
			trinityPaid: null,
			jointPaid: null,
			currency: "USD",
		},
		focused: true,
	},

	methods: {
		/**
		 * Currency convert function stub.
		 * In a real app, you would use an API to get the latest exchange rates,
		 * and we'd need to support all currency codes, not just EUR, USD and GBP.
		 * However, for the purposes of this assignment, this is fine.
		 * @param {"EUR" | "USD" | "GBP"} from - Currency code to convert from
		 * @param {"EUR" | "USD" | "GBP"} to - Currency code to convert to
		 * @param {number} amount - Amount to convert
		 * @returns {number} Converted amount
		 */
		currencyConvert(from, to, amount) {
			const rates = {
				USD: 1,
				EUR: 0.99,
				GBP: 0.85
			};

			return amount * rates[to] / rates[from];
		},

		trySubmitForm() {
			const d = this.formData;
			if (d.description && d.for && (d.neoPaid || d.trinityPaid || d.jointPaid)) {
				this.expenses.push({...this.formData});
				this.formData = {
					description: null,
					for: null,
					neoPaid: null,
					trinityPaid: null,
					jointPaid: null,
				};
				this.focused = true;
			}
		},

		unfocus() {
			this.focused = false;
		},

		totalCost(i) {
			const e = this.expenses[i];
			return e.neoPaid + e.trinityPaid + e.jointPaid;
		}
	},

	// I figured out how to make keyboard shortcuts from
	// https://shubhamjain.co/2019/06/09/vue-shortcuts/
	// https://stackoverflow.com/questions/40283406/how-to-capture-any-keypress-event-in-vuejs-without-using-input-element
	mounted() {
		let self = this;
		window.addEventListener('keyup', function(ev) {
			if (ev.key === "a") {
				// self.showForm();
			}
		});
	},

	computed: {
		total_balance () {
			let total = 0;

			for (let expense of this.expenses) {
				let trinity_paid = 
					(expense.for === JOINT ? expense.trinityPaid : 0) +
					(expense.for === NEO ? expense.jointPaid : 0);
				let neo_paid = 
					(expense.for === JOINT ? expense.neoPaid : 0) +
					(expense.for === TRINITY ? expense.jointPaid : 0);
				let trinity_paid_for_neo = expense.for === NEO ? expense.trinityPaid : 0;
				let neo_paid_for_trinity = expense.for === TRINITY ? expense.neoPaid : 0;

				total += (trinity_paid - neo_paid)/2 + trinity_paid_for_neo - neo_paid_for_trinity;
			}

			return total;
		}
	}
}, "#app");