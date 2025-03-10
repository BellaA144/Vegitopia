import Image from 'next/image'

const Hero = () => {
  return (
    <section className='flex flex-col md:flex-row items-center justify-between bg-green-100 p-8 rounded-2xl shadow-lg mb-5'>
      <div className='max-w-lg text-center md:text-left'>
        <h1 className='text-4xl md:text-5xl font-black text-green-800'>Welcome to Vegitopia, Vegans!</h1>
        <p className='mt-4 text-lg text-gray-700'>
          Fresh, organic, and 100% plant-based. Your one-stop shop for the healthiest vegetables, grains, and dairy-free
          alternatives.
        </p>
      </div>

      <div className='mt-6 md:mt-0'>
        <Image
          src='/images/illustrations/hero/vegetables-hero.png'
          alt='Fresh vegetables and fruits'
          width={400}
          height={250}
        />
      </div>
    </section>
  )
}

export default Hero
