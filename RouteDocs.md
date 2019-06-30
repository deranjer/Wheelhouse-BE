# 

Generated Docs for WheelhouseBE

## Routes

<details>
<summary>`/`</summary>

- [(*Cors).Handler-fm]()
- [Logger]()
- [Recoverer]()
- [SetContentType.func1]()
- **/**
	- _GET_
		- [main.main.func1]()

</details>
<details>
<summary>`/login`</summary>

- [(*Cors).Handler-fm]()
- [Logger]()
- [Recoverer]()
- [SetContentType.func1]()
- **/login**
	- _POST_
		- [main.UserLogin]()

</details>
<details>
<summary>`/user/*`</summary>

- [(*Cors).Handler-fm]()
- [Logger]()
- [Recoverer]()
- [SetContentType.func1]()
- **/user/***
	- **/**
		- _POST_
			- [CreateUser]()

</details>
<details>
<summary>`/user/*/{userID}/*`</summary>

- [(*Cors).Handler-fm]()
- [Logger]()
- [Recoverer]()
- [SetContentType.func1]()
- **/user/***
	- **/{userID}/***
		- **/**
			- _GET_
				- [GetUserByID]()
			- _PUT_
				- [UpdateUserByID]()
			- _DELETE_
				- [DeleteUserByID]()

</details>

Total # of routes: 4
