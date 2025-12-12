package com.kodekernel.ecommerce.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kodekernel.ecommerce.entity.Coupon;
import com.kodekernel.ecommerce.repository.CouponRepository;

@Service
public class CouponService {
    @Autowired
    private CouponRepository couponRepository;

    public List<Coupon> listCoupons() {
        return couponRepository.findAll();
    }

    public void deleteCoupon(String code) {
        couponRepository.deleteById(code);
    }

    public Coupon addCoupon(Coupon coupon) {
        return couponRepository.save(coupon);
    }

}
