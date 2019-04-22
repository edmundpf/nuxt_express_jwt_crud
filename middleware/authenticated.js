export default function ({ store, redirect }) {
	if (store.state.logged_in) {
		return redirect('/')
	}
}