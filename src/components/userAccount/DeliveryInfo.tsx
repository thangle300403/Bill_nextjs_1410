import React, { useEffect, useState } from "react";
import { FormikProps } from "formik";
import { DeliveryFormValues, Province, Ward } from "@/types/address";
import { UserServer } from "@/types/user";
import { axiosAuth } from "@/lib/axiosAuth";

interface DeliveryInfoProps {
  formik: FormikProps<DeliveryFormValues>;
  provinces?: Province[];
  loggedUser?: UserServer;
}

export default function DeliveryInfo({
  formik,
  provinces = [],
}: // loggedUser,
DeliveryInfoProps) {
  const inputBase =
    "w-full border border-gray-300 rounded-xl px-5 py-3 text-sm text-gray-800 bg-white shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition";
  const labelStyle = "text-sm font-semibold text-gray-700 mb-1 block";
  const errorStyle = "text-sm text-red-500 mt-1";

  const [wards, setWards] = useState<Ward[]>([]);

  const [searchProvince, setSearchProvince] = useState("");
  const [searchWard, setSearchWard] = useState("");

  const filteredWards = wards.filter((w) =>
    w.name.toLowerCase().includes(searchWard.toLowerCase())
  );

  const filteredProvinces = provinces.filter((p) =>
    p.name.toLowerCase().includes(searchProvince.toLowerCase())
  );

  useEffect(() => {
    const load = async () => {
      if (formik.values.province) {
        const distRes = await axiosAuth.get(
          `/wards/province/${formik.values.province}`
        );
        setWards(distRes.data);
      }
    };

    load();
  }, [formik.values.province]);

  const handleChangeProvince = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    formik.handleChange(e);
    const id = e.target.value;
    const res = await axiosAuth.get(`/wards/province/${id}`);
    setWards(res.data);
    formik.setFieldValue("ward", "");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
      {/* Fullname */}
      <div>
        <label htmlFor="fullname" className={labelStyle}>
          Họ và tên
        </label>
        <input
          id="fullname"
          {...formik.getFieldProps("fullname")}
          className={inputBase}
        />
        {formik.touched.fullname && formik.errors.fullname && (
          <div className={errorStyle}>{formik.errors.fullname}</div>
        )}
      </div>

      {/* Mobile */}
      <div>
        <label htmlFor="mobile" className={labelStyle}>
          Số điện thoại
        </label>
        <input
          id="mobile"
          {...formik.getFieldProps("mobile")}
          className={inputBase}
        />
        {formik.touched.mobile && formik.errors.mobile && (
          <div className={errorStyle}>{formik.errors.mobile}</div>
        )}
      </div>

      {/* Province Group */}
      <div>
        <label className={labelStyle}>Tỉnh / Thành phố</label>
        <input
          type="text"
          placeholder="Tìm tỉnh / thành phố..."
          value={searchProvince}
          onChange={(e) => setSearchProvince(e.target.value)}
          className={
            "w-full border border-gray-300 rounded-lg px-2 py-2 text-xs text-gray-800 bg-white shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition mb-2"
          }
        />
        <select
          id="province"
          value={formik.values.province}
          onChange={handleChangeProvince}
          className={inputBase + " appearance-none"}
        >
          <option value="">Chọn tỉnh / thành phố</option>
          {filteredProvinces?.map((province) => (
            <option key={province.id} value={province.id}>
              {province.name}
            </option>
          ))}
        </select>
        {formik.touched.province && formik.errors.province && (
          <div className={errorStyle}>{formik.errors.province}</div>
        )}
      </div>

      {/* Ward Group */}
      <div>
        <label className={labelStyle}>Phường / Xã</label>
        <input
          type="text"
          placeholder="Tìm phường / xã..."
          value={searchWard}
          onChange={(e) => setSearchWard(e.target.value)}
          className={
            "w-full border border-gray-300 rounded-lg px-2 py-2 text-xs text-gray-800 bg-white shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition mb-2"
          }
        />
        <select
          id="ward"
          value={formik.values.ward}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={inputBase + " appearance-none"}
        >
          <option value="">Chọn phường / xã</option>
          {filteredWards.map((ward) => (
            <option key={ward.id} value={ward.id}>
              {ward.name}
            </option>
          ))}
        </select>
        {formik.touched.ward && formik.errors.ward && (
          <div className={errorStyle}>{formik.errors.ward}</div>
        )}
      </div>

      {/* Address */}
      <div className="md:col-span-2">
        <label htmlFor="address" className={labelStyle}>
          Địa chỉ chi tiết
        </label>
        <input
          id="address"
          {...formik.getFieldProps("address")}
          className={inputBase}
        />
        {formik.touched.address && formik.errors.address && (
          <div className={errorStyle}>{formik.errors.address}</div>
        )}
      </div>
    </div>
  );
}
