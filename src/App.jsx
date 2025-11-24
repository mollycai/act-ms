import { useEffect } from 'react'
import { getBanners, getActivityCategories } from './apis'


function App() {
	useEffect(() => {
		async function fetchData() {
			const banners = await getBanners()
			const categories = await getActivityCategories()
			console.log('banners:', banners)
			console.log('categories:', categories)
		}
		fetchData()
	}, [])

  return (
    <>
      活动页面
    </>
  )
}

export default App
