# Compilation of Code for GPT

This is a markdown document that compiles snippets of code for GPT to read in order to learn the coding style and code snippets of CDT's frontend template.

## Folder Structure

The frontend template follows Vuexy's starter template folder structure.

```bash
src
├── @core
├── @layouts
├── @menu
├── app
│   ├── (blank-layout-pages)
│   │   ├── login
│   │   │   ├── actions.ts
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)
│   │   ├── about
│   │   │   └── page.tsx
│   │   ├── home
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── [...not-found]
│   │   └── page.tsx
│   ├── auth
│   │   └── callback
│   │       └── route.ts
│   ├── master
│   │   ├── table-example
│   │   │   ├── actions
│   │   │   │   └── index.ts
│   │   │   ├── components
│   │   │   │   ├── Products.tsx
│   │   │   │   └── UpsertProduct.tsx
│   │   │   ├── columns.ts
│   │   │   ├── page.tsx
│   │   │   └── types.ts
│   │   └── layout.tsx
│   ├── favicon.ico
│   ├── globals.css
│   └── layout.tsx
├── assets
│   └── iconify-icons
│       ├── bundle-icons-css.ts
│       └── generated-icons.css
├── components // Global components. Components that can be reused anywhere goes here
│   ├── layout
│   │   └── vertical
│   │       └── VerticalMenu.tsx
│   ├── stepper-dot
│   ├── theme
│   ├── ConfirmationDialog.tsx
│   ├── DataTableRowSelection.tsx
│   ├── Form.tsx
│   ├── GenerateMenu.tsx
│   ├── Link.tsx
│   ├── Providers.tsx
│   └── TablePaginationComponent.tsx
├── configs
│   ├── primaryColorConfig.ts
│   └── themeConfig.ts
├── data
│   └── navigation
│       ├── horizontalMenuData.tsx
│       └── verticalMenuData.tsx
├── libs
│   └── styles
│       └── AppReactToastify.tsx
├── types
│   └── menuTypes.ts
├── utils
│   ├── supabase
│   │   ├── client.ts
│   │   ├── middleware.ts
│   │   └── server.ts
│   ├── caseInsensitiveSort.ts
│   ├── exportToCSV.ts
│   ├── getInitials.ts
│   ├── getUserInfo.ts
│   ├── logger.ts
│   ├── signOut.ts
│   ├── string.ts
│   └── toastUtility.tsx
└── views
    ├── Login.tsx
    └── NotFound.tsx
.editorconfig
.env
.eslintrc.js
.gitignore
.npmrc
.prettierrc.json
.stylelintrc.json
declarations.d.ts
middleware.ts
next-env.d.ts
next.config.ts
package.json
pnpm-lock.yaml
postcss.config.mjs
README.md
tailwind.config.ts
tsconfig.json
```

## Code Snippets

### Login

These are code snippets that is responsible for the login process of this frontend template.

`src/app/(blank-layout-pages)/layout.tsx`

This is the main layout for all pages under the folder `(blank-layout-pages)`.

```typescript
// Type Imports
import type { ChildrenType } from '@core/types'

// Component Imports
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'

type Props = ChildrenType

const Layout = async (props: Props) => {
  const { children } = props

  // Vars
  const direction = 'ltr'
  const systemMode = await getSystemMode()

  return (
    <Providers direction={direction}>
      <BlankLayout systemMode={systemMode}>{children}</BlankLayout>
    </Providers>
  )
}

export default Layout
```

`src/app/(blank-layout-pages)/login/actions.ts`

This is the code for the server actions that handles the login for this frontend template.

```typescript
'use server'

import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function signInWithDevStreamId() {
  const supabase = await createClient()

  const { data } = await supabase.auth.signInWithOAuth({
    provider: 'keycloak',
    options: {
      scopes: 'openid',
      redirectTo: process.env.REDIRECT_URI_CALLBACK
    }
  })

  if (data.url) {
    return redirect(data.url)
  }
}
```

`src/app/(blank-layout-pages)/login/page.tsx`

This is the code for the login page for this frontend template.

```typescript
// Next Imports
import { redirect } from 'next/navigation'

import type { Metadata } from 'next'

// Component Imports
import Login from '@views/Login'
import { createClient } from '@/utils/supabase/server'
import { logger } from '@/utils/logger'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account'
}

const LoginPage = async () => {
  const supabase = await createClient()

  const { data: userData, error } = await supabase.auth.getUser()

  logger('Auth Check', { user: userData?.user, error }, 'info')

  if (!error && userData?.user) {
    redirect('/')
  }

  return <Login />
}

export default LoginPage
```

### Homepage

These are code snippets that is for the homepage of this frontend template.

`src/app/(dashboard)/layout.tsx`

This is the main layout for all pages under the folder `(dashboard)`.

```typescript
// Type Imports
import type { ChildrenType } from '@core/types'

// Component Imports
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'

type Props = ChildrenType

const Layout = async (props: Props) => {
  const { children } = props

  // Vars
  const direction = 'ltr'
  const systemMode = await getSystemMode()

  return (
    <Providers direction={direction}>
      <BlankLayout systemMode={systemMode}>{children}</BlankLayout>
    </Providers>
  )
}

export default Layout
```

`src/app/(dashboard)/home/page.tsx`

This is the code for the home page for this frontend template.

```typescript
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { jwtDecode } from 'jwt-decode'

export default async function Page() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect('/login')
  }

  return <h1>Home page!</h1>
}
```

### Auth Callback

This is the code that is for the auth callback of this frontend template.

`src/app/auth/callback/route.ts`

```typescript
import { NextResponse } from 'next/server'

import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)

  const code = searchParams.get('code')

  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
```

### Master Data

These are the code snippets that are for the template whenever we want to create a master table. The current code snippets are for the master `table-example`. Whenever a user wants to create a new module, for example module `Objects`, create a new folder inside master, so that the path will be `src/app/master/objects/`. Whenever a user wants to create a new table template, you can refer to these files below.

`src/app/master/layout.tsx`

This is the main layout for all the pages under the folder `master`.

```typescript
import Button from '@mui/material/Button'

import type { ChildrenType } from '@core/types'

import LayoutWrapper from '@layouts/LayoutWrapper'
import VerticalLayout from '@layouts/VerticalLayout'
import HorizontalLayout from '@layouts/HorizontalLayout'

import Providers from '@components/Providers'
import Navigation from '@components/layout/vertical/Navigation'
import Navbar from '@components/layout/vertical/Navbar'
import VerticalFooter from '@components/layout/vertical/Footer'
import HorizontalFooter from '@components/layout/horizontal/Footer'
import ScrollToTop from '@core/components/scroll-to-top'

import { getMode, getSystemMode } from '@core/utils/serverHelpers'

const Layout = async ({ children }: ChildrenType) => {
  const direction = 'ltr'
  const mode = await getMode()
  const systemMode = await getSystemMode()

  return (
    <Providers direction={direction}>
      <LayoutWrapper
        systemMode={systemMode}
        verticalLayout={
          <VerticalLayout navigation={<Navigation mode={mode} />} navbar={<Navbar />} footer={<VerticalFooter />}>
            {children}
          </VerticalLayout>
        }
        horizontalLayout={<HorizontalLayout footer={<HorizontalFooter />}>{children}</HorizontalLayout>}
      />
      <ScrollToTop className='mui-fixed'>
        <Button variant='contained' className='is-10 bs-10 rounded-full p-0 min-is-0 flex items-center justify-center'>
          <i className='tabler-arrow-up' />
        </Button>
      </ScrollToTop>
    </Providers>
  )
}

export default Layout
```

`src/app/master/table-example/page.tsx`

This is the code snippet for the page of a module in the master module. In this case, we are looking at the page of `table-example` in `master`. This is where we call the data

```typescript
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { getProducts } from './actions'
import Products from './components/Products'

export default async function ProductsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect('/login')
  }

  const products = await getProducts()

  return <Products initialData={products || []} />
}
```

`src/app/master/table-example/types.ts`

This is the data type that is available for the module `table-example`. Create the types according to the columns and data type of each column based on user's prompt.

```typescript
export interface ProductType {
  id?: string | null | undefined
  name: string
  description: string
  type: string
  created_at?: string
}
```

`src/app/master/table-example/columns.ts`

This is the code where we declare all the columns that will be used for the table in that module. Follow this code as a template standard. Later when a user gives you the data types of the table, you make the columns according to the data types that they give you.

```typescript
import { createColumnHelper } from '@tanstack/react-table'
import { format, parseISO } from 'date-fns'

import type { ProductType } from './types'
import { caseInsensitiveSort } from '@/utils/caseInsensitiveSort'

const columnHelper = createColumnHelper<ProductType>()

const columns = [
  columnHelper.accessor('name', {
    cell: info => info.getValue(),
    header: 'Name',
    enableSorting: true,
    sortingFn: caseInsensitiveSort
  }),
  columnHelper.accessor('description', {
    cell: info => info.getValue(),
    header: 'Description',
    enableSorting: true,
    sortingFn: caseInsensitiveSort
  }),
  columnHelper.accessor('type', {
    cell: info => info.getValue(),
    header: 'Type',
    enableSorting: true,
    sortingFn: caseInsensitiveSort
  }),
  columnHelper.accessor('created_at', {
    cell: info => {
      const value = info.getValue()

      return value ? format(parseISO(value), 'yyyy-MM-dd HH:mm:ss') : '-'
    },
    header: 'Created At',
    enableSorting: true,
    sortingFn: 'datetime'
  })
]

export default columns
```

`src/app/master/table-example/components/Products.tsx`

This is the main component to handle the data. This is where the user can interact with the application.

```typescript
'use client'

import { useState, useTransition } from 'react'

import { Box, Skeleton } from '@mui/material'

import type { ProductType } from '../types'

import columns from '../columns'
import UpsertProduct from './UpsertProduct'
import DataTableRowSelection from '@/components/DataTableRowSelection'

import { addProduct, deleteProducts, updateProduct } from '../actions'
import { showPromiseToast } from '@/utils/toastUtility'
import handleExportToCSV from '@/utils/exportToCSV'

type ProductsProps = {
  initialData: ProductType[]
}

export default function Products({ initialData }: ProductsProps) {
  const [products, setProducts] = useState<ProductType[]>(initialData)
  const [selectedRows, setSelectedRows] = useState<ProductType[]>([])
  const [open, setOpen] = useState<boolean>(false)
  const [mode, setMode] = useState<'add' | 'edit'>('add')
  const [isPending, startTransition] = useTransition()

  const handleAddProduct = async (newProduct: ProductType) => {
    startTransition(async () => {
      const addPromise = await showPromiseToast(() => addProduct(newProduct), {
        pending: 'Adding product...',
        success: 'Product added successfully!',
        error: 'Failed to add product'
      })

      const added = addPromise

      if (added) {
        setProducts(prev => (prev ? [...prev, added] : [added]))
      }
    })
  }

  const handleDeleteProducts = async (deletedProducts: ProductType[]) => {
    startTransition(async () => {
      const deletePromise = await showPromiseToast(() => deleteProducts(deletedProducts), {
        pending: 'Deleting products...',
        success: 'Products deleted successfully!',
        error: 'Failed to delete products'
      })

      const deleted = deletePromise

      if (deleted) {
        setProducts(prev => prev.filter(product => !deletedProducts.includes(product)))
      }
    })
  }

  const handleUpdateProduct = async (updatedProduct: ProductType) => {
    startTransition(async () => {
      const updatePromise = await showPromiseToast(() => updateProduct(updatedProduct), {
        pending: 'Updating product...',
        success: 'Product updated successfully!',
        error: 'Failed to update product'
      })

      const savedProduct = await updatePromise

      if (savedProduct) {
        setProducts(prev => prev.map(p => (p.id === savedProduct.id ? savedProduct : p)))
      }
    })
  }

  const handleOpenAddModal = () => {
    setMode('add')
    setOpen(true)
  }

  const handleOpenEditModal = () => {
    setMode('edit')
    setOpen(true)
  }

  return (
    <div>
      {isPending || !products ? (
        <Box>
          <Skeleton variant='rectangular' width='100%' height={50} />
          <Skeleton variant='rectangular' width='100%' height={50} sx={{ mt: 2 }} />
          <Skeleton variant='rectangular' width='100%' height={50} sx={{ mt: 2 }} />
        </Box>
      ) : (
        <DataTableRowSelection
          data={products}
          dynamicColumns={columns}
          tableName='Products Table'
          setOpen={handleOpenAddModal}
          onSelectedRowsChange={setSelectedRows}
          onDeleteProduct={handleDeleteProducts}
          onEditProduct={handleOpenEditModal}
          onExportToCSV={() => handleExportToCSV(products, 'Products')}
        />
      )}
      <UpsertProduct
        open={open}
        setOpen={setOpen}
        mode={mode}
        initialProduct={mode === 'edit' && selectedRows.length === 1 ? selectedRows[0] : null}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
      />
    </div>
  )
}
```

`src/app/master/table-example/components/UpsertProduct.tsx`

```typescript
'use client'

import { useEffect, useTransition } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Grid from '@mui/material/Grid2'

// Custom Components
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { DialogActions } from '@mui/material'

import CustomTextField from '@core/components/mui/TextField'
import Form from '@components/Form'

import type { ProductType } from '../types'

// Validation Schema
const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  type: yup.string().required('Type is required')
})

type ProductDialogType = {
  open: boolean
  mode: 'add' | 'edit'
  initialProduct: ProductType | null
  setOpen: (open: boolean) => void
  onAddProduct: (product: ProductType) => void
  onUpdateProduct: (product: ProductType) => void
}

const UpsertProduct = ({ open, mode, initialProduct, setOpen, onAddProduct, onUpdateProduct }: ProductDialogType) => {
  const handleClose = (event: object, reason: 'backdropClick' | 'escapeKeyDown' | 'closeClick' | string) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      return
    }

    setOpen(false)
  }

  const [isPending, startTransition] = useTransition()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ProductType>({
    resolver: yupResolver(schema),
    defaultValues: { name: '', description: '', type: '' }
  })

  useEffect(() => {
    if (initialProduct && mode === 'edit') {
      reset(initialProduct)
    } else if (mode === 'add') {
      reset({ name: '', description: '', type: '' })
    }
  }, [initialProduct, mode, reset])

  const onSubmit = (data: ProductType) => {
    startTransition(async () => {
      try {
        if (mode === 'add') {
          onAddProduct(data)
        } else if (initialProduct && initialProduct.id) {
          onUpdateProduct({ ...initialProduct, ...data })
        }

        reset()
        setOpen(false)
      } catch (error) {
        console.error(`Error ${mode === 'add' ? 'adding' : 'updating'} product:`, error)
        alert(`Failed to ${mode === 'add' ? 'add' : 'update'} product`)
      }
    })
  }

  const handleCancel = () => {
    reset()
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      closeAfterTransition={false}
      onClose={handleClose}
      aria-labelledby='form-dialog-title'
    >
      <DialogTitle id='form-dialog-title'>{mode === 'add' ? 'Add New Product' : 'Edit Product'}</DialogTitle>
      <DialogContent>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
              <Controller
                name='name'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Name'
                    placeholder='Product Name'
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name='description'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Description'
                    placeholder='Product Description'
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name='type'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Type'
                    placeholder='Product Type'
                    error={!!errors.type}
                    helperText={errors.type?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
          <DialogActions className='mt-4 p-0'>
            <Button variant='outlined' color='error' onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant='contained' type='submit' disabled={isPending} color={mode === 'add' ? 'primary' : 'info'}>
              {isPending ? (mode === 'add' ? 'Adding...' : 'Updating...') : mode === 'add' ? 'Add' : 'Update'}
            </Button>
          </DialogActions>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default UpsertProduct
```

`src/app/master/table-example/actions/index.ts`

```typescript
'use server'

import { revalidatePath } from 'next/cache'

import type { ProductType } from '../types'

import { createClient } from '@/utils/supabase/server'
import { logger } from '@/utils/logger'

export async function getProducts(): Promise<ProductType[]> {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.from('products').select('id, name, description, type, created_at')

    if (error) throw new Error(error.message)

    logger('getProducts', data, 'info')

    return data || []
  } catch (error: any) {
    logger('getProducts', error, 'error')

    return []
  }
}

export async function addProduct(product: ProductType): Promise<ProductType | null> {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.from('products').insert([product]).select().single()

    if (error) throw new Error(error.message)

    logger('addProducts', data, 'info')

    revalidatePath('/master/products')

    return data
  } catch (error: any) {
    logger('addProduct', error, 'error')

    throw error
  }
}

export async function updateProduct(product: ProductType): Promise<ProductType | null> {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.from('products').update(product).eq('id', product.id).select().single()

    if (error) {
      throw new Error(error.message)
    }

    logger('updateProduct', data, 'info')

    revalidatePath('/master/products')

    return data
  } catch (error: any) {
    logger('updateProduct', error, 'error')

    throw error
  }
}

export async function deleteProducts(products: ProductType[]): Promise<boolean> {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('products')
      .delete()
      .in(
        'id',
        products.map(product => product.id)
      )

    if (error) throw new Error(error.message)

    logger('deleteProduct', data, 'info')

    revalidatePath('/master/products')

    return true
  } catch (error: any) {
    logger('deleteProducts', error, 'error')

    throw error
  }
}
```
