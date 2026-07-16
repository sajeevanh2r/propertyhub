'use server'

import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['BUYER', 'SELLER']),
})

export async function registerUser(prevState: any, formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const role = formData.get('role') as 'BUYER' | 'SELLER'

  const validatedFields = RegisterSchema.safeParse({
    name,
    email,
    password,
    role,
  })

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  try {
    // Check duplicate email
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return {
        message: 'Email already registered',
      }
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10)

    // Save user
    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    })

    return {
      success: true,
      message: 'Account created successfully! Redirecting...',
    }
  } catch (error) {
    console.error('Registration action error:', error)
    return {
      message: 'Something went wrong during account creation.',
    }
  }
}
