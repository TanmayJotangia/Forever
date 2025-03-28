import React from 'react';

const NewsletterBox = () => {

    const onSubmitHandler = (e) => {
        e.preventDefault();
    }

  return (
    <div className='text-center'>
        <p className='text-2xl font-medium text-gray-800 py-8'>Subscribe to get 20% off</p>
        <p className='text-gray-400 mt-3'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem, nostrum delectus incidunt quia, voluptatibus aliquam iusto cupiditate numquam, sint minima hic impedit dolor velit sunt deleniti ex temporibus inventore doloremque? </p>
        <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex itemm-center gap-3 mx-auto my-6 border pl-3'>
            <input type="email" placeholder='Enter your email' className='w-full sm:flex-1 outline-none' required/>
            <button type='submit' className='bg-black text-white text-xs px-10 py-4'>Subscribe</button>
        </form>
    </div>
  )
}

export default NewsletterBox