'use client'

import Typography from '@mui/material/Typography'

import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'

import Logo from '@components/layout/shared/Logo'

// Config Imports
import themeConfig from '@configs/themeConfig'
import { signInWithDevStreamId } from '@/app/(blank-layout-pages)/login/actions'

const LoginV2 = () => {
  return (
    <div className='flex bs-full justify-center'>
      <div className='flex justify-center items-center bs-full !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <div className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
          <Logo />
        </div>

        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0'>
          <Card>
            <CardContent className='flex flex-col items-center text-center gap-4'>
              <div className='flex flex-col gap-1'>
                <Typography variant='h4'>{`Welcome to ${themeConfig.templateName}! 👋🏻`}</Typography>
                <Typography>Please sign-in with your account</Typography>
              </div>
              <form action={signInWithDevStreamId}>
                <Button type='submit' fullWidth variant='contained' className='text-white'>
                  Login with DevStreams-Auth
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default LoginV2
